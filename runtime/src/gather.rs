#![cfg_attr(not(feature = "std"), no_std)]

use rstd::prelude::*;
use support::{decl_module, decl_storage, decl_event, dispatch::Result};
use system::ensure_signed;
use codec::{Encode, Decode};
use sr_primitives::RuntimeDebug;
use primitives::offchain::StorageKind;

#[cfg(feature = "std")]
use serde::{Serialize, Deserialize};
#[cfg(feature = "std")]
use serde_json;
#[cfg(feature = "std")]
use handlebars;

#[cfg(feature = "std")]
use gather_emailer::{Email, EmailConfig, make_lettre_transport};

pub const EMAIL_CONFIG_STORAGE_KEY: &[u8] = b"email_config";

// TYPES
pub type Reference = u64;
pub type CommunityId = Reference;
pub type GroupId = Reference;
pub type GatheringId = Reference;
pub type ExternalData = Vec<u8>; //potentially IPFS CiD
pub type LatLong = (u64, u64); // Latitude, Longitude
pub type Timezone = u8;
/// UTC epoch time
pub type Timestamp = u64; 

/// We have multiple ways to define and understand a location
#[derive(Encode, Decode, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub enum Location {
    /// This is a globally acting group, events are everywhere or nowhere
    Global,
    /// This is a remote acting group, but bound to a base timezone
    Remote(Option<Timezone>),
    /// This group is bound to a specific location or Region?
    Local(LatLong),
}

impl Default for Location {
    fn default() -> Self { Location::Global }
}

/// The role attachted to a specific Membership between Account
/// and either Group or Community, by increasing privileges
#[derive(Encode, Decode, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub enum Role {
    /// Regular Member
    Member,
    /// + Can manage content from members - edit and delete
    Moderator, // saved for later
    /// + Can create and edit gatherings, organise waiting lists
    Organiser, 
    /// + Can edit group/community info, change roles of other users
    Admin,
    /// GTFO
    Banned,
}

impl Default for Role {
    fn default() -> Self { Role::Member }
}

#[derive(Encode, Decode, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub enum RSVPStates {
    Yes,
    No,
    Maybe,
    Waitinglist,
}

impl Default for RSVPStates {
    fn default() -> Self { RSVPStates::Maybe }
}


/// The Community Definition
#[derive(Encode, Decode, Default, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct Community {
    /// Title, description and alike are move off chain
    pub metadata: ExternalData,
    /// when was this created?
    pub created_at: Timestamp,
    /// when last updated?
    pub updated_at: Timestamp,
}

/// This is a Group
#[derive(Encode, Decode, Default, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct Group {
    /// Which community does this group belong to
    pub belongs_to: CommunityId,
    /// Where is this group "located"
    pub location: Location,
    /// Further user informational group info
    pub metadata: ExternalData,
    /// when was this created?
    pub created_at: Timestamp,
    /// when last updated?
    pub updated_at: Timestamp,
}

/// Definition for a specific Gathering
#[derive(Encode, Decode, Default, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct Gathering {
    pub belongs_to: Vec<GroupId>,
    /// Where does this take place?
    pub location: Location,
    pub starts_at: Timestamp,
    pub ends_at: Option<Timestamp>,
    /// Further user informational group info
    pub rsvp_opens: Option<Timestamp>,
    pub rsvp_closes: Option<Timestamp>,
    pub max_rsvps: Option<u32>,
    pub metadata: ExternalData,
    /// when was this created?
    pub created_at: Timestamp,
    /// when last updated?
    pub updated_at: Timestamp,
}

/// Definition for a specific Gathering
#[derive(Encode, Decode, Default, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct GatheringInput {
    pub location: Option<Location>,
    pub starts_at: Option<Timestamp>,
    pub ends_at: Option<Timestamp>,
    pub rsvp_opens: Option<Timestamp>,
    pub rsvp_closes: Option<Timestamp>,
    pub max_rsvps: Option<u32>,
    pub metadata: Option<ExternalData>,
}

impl GatheringInput {
    pub fn as_new(self, id: GroupId, now: Timestamp) -> Gathering {
        Gathering {
            belongs_to: vec![id],
            created_at: now,
            updated_at: now,
            location: self.location.unwrap_or_default(),
            starts_at: self.starts_at.unwrap_or_default(),
            ends_at: self.ends_at,
            rsvp_opens: self.rsvp_opens,
            rsvp_closes: self.rsvp_closes,
            max_rsvps: self.max_rsvps,
            metadata: self.metadata.unwrap_or_default(),
        }
    }
    fn update(self, gathering: Gathering, now: Timestamp) -> Gathering {
        Gathering {
            belongs_to: gathering.belongs_to,
            created_at: gathering.created_at,
            updated_at: now,
            location: self.location.unwrap_or(gathering.location),
            starts_at: self.starts_at.unwrap_or(gathering.starts_at),
            ends_at: self.ends_at.map_or(gathering.ends_at, |m| Some(m)),
            rsvp_opens: self.rsvp_opens.map_or(gathering.rsvp_opens, |m| Some(m)),
            rsvp_closes: self.rsvp_closes.map_or(gathering.rsvp_closes, |m| Some(m)),
            max_rsvps: self.max_rsvps.map_or(gathering.max_rsvps, |m| Some(m)),
            metadata: self.metadata.unwrap_or(gathering.metadata),
        }
    }

    pub fn then(then: Timestamp) -> GatheringInput {
        let mut g = GatheringInput::default();
        g.starts_at = Some(then);
        g
    }
}


/// Define the Roles and thus privileges of a specific member
#[derive(Encode, Decode, Default, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct Membership {
    pub role: Role,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

impl Membership {
    pub fn admin(now: Option<Timestamp>) -> Membership {
        Membership {
            role: Role::Admin,
            created_at: now.unwrap_or_default(),
            updated_at: now.unwrap_or_default(),
        }
    }
}

#[derive(Encode, Decode, Default, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct RSVP {
    pub state: RSVPStates,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

impl RSVP {
    pub fn yes(now: Option<Timestamp>) -> RSVP {
        RSVP {
            state: RSVPStates::Yes,
            created_at: now.unwrap_or_default(),
            updated_at: now.unwrap_or_default(),
        }
    }
}

/// The module's configuration trait.
pub trait Trait: system::Trait + timestamp::Trait {
	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

#[derive(Encode, Decode, Clone, PartialEq, RuntimeDebug)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
/// internal offchain worker notifications
enum Notification<T: Trait> {
    GatheringCreated(GroupId, GatheringId),
    RSVPUpdated(GatheringId, T::AccountId),
}

// This module's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as Gather
    {
		Communities get(communities) config(): map CommunityId => Option<Community>;
        CommunitiesMembers get(communities_members) config(): map CommunityId => Vec<T::AccountId>;
        MembersCommunities get(members_communities) config(): map T::AccountId => Vec<CommunityId>;
        CommunitiesGroups get(communities_groups) config(): map CommunityId => Vec<GroupId>;

		Groups get(groups) config(): map GroupId => Option<Group>;
        GroupsMembers get(groups_members) config(): map GroupId => Vec<T::AccountId>;
        MembersGroups get(members_groups) config(): map T::AccountId => Vec<GroupId>;
        GroupsGatherings get(groups_gatherings) config(): map GroupId => Vec<GatheringId>;

        Gatherings get(gatherings) config(): map GatheringId => Option<Gathering>;
        GatheringsMembers get(gatherings_members) config(): map GatheringId => Vec<T::AccountId>;
        MembersGatherings get(members_gatherings) config(): map T::AccountId => Vec<GatheringId>;

        Memberships get(memberships) config(): map (T::AccountId, Reference) => Option<Membership>;
        RSVPs get(rsvps) config(): map (T::AccountId, GatheringId) => Option<RSVP>;

        // nonces
        Nonce get(nonce) config(): Reference;
        /// Notifications going to the offchain worker, cleared on every insteance:
        Notifications: Vec<Notification<T>>;
    }
}

// The module's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		fn deposit_event() = default;

        fn on_initialize(_now: T::BlockNumber) {
            Notifications::<T>::kill();
        }

        // ---- Community

        pub fn create_community(origin, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            let id = Self::next_id().ok_or("Next id overflow")?;
            let now = Self::now();

            Communities::insert(id, Community {
                    metadata: metadata,
                    created_at: now,
                    updated_at: now
            });

            Memberships::<T>::insert( (&who, id), Membership {
                role: Role::Admin,
                created_at: now,
                updated_at: now
            });

            CommunitiesMembers::<T>::insert(id, vec![&who]);
            MembersCommunities::<T>::append_or_insert(who, &[id][..]);

            Self::notify(RawEvent::CommunityCreated(id));

            Ok(())
        }

        pub fn update_community(origin, id: CommunityId, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            let membership = Memberships::<T>::get( (&who, id) ).ok_or("Not a Member")?;

            if membership.role != Role::Admin {
                return Err("Only the admin can update the group info")
            }
            
            let mut community = Communities::get(id).ok_or("Unknown Community")?; // this should never happen,  but let's be safe.
            community.updated_at = Self::now();
            community.metadata = metadata;
            Communities::insert(id, community);

            Self::notify(RawEvent::CommunityUpdated(id));
            Ok(())
        }

        // pub fn delete_community(origin, community: CommunityId) -> Result {
        //     let who = ensure_signed(origin)?;
        //     // + ensure has role admin
        //     Err("not yet implemented")
        // }

        // ------ Community Membership

        pub fn join_community(origin, id: CommunityId) -> Result {
            let who = ensure_signed(origin)?;
            if !Communities::exists(id) {
                return Err("Unknown community")
            }
            if Memberships::<T>::exists( (&who, id) ) {
                return Err("Already a member")
            }

            let now = Self::now();

            Memberships::<T>::insert( (&who, id), Membership {
                role: Role::Member,
                created_at: now,
                updated_at: now,
            });

            CommunitiesMembers::<T>::append(id, &[&who][..]);
            MembersCommunities::<T>::append_or_insert(&who, &[id][..]);

            Self::notify(RawEvent::CommunityMembershipChanged(id, who));

            Ok(())
        }

        pub fn update_community_membership(origin, community: CommunityId, who: T::AccountId, role: Role) -> Result {
            let author = ensure_signed(origin)?;
            let membership = Memberships::<T>::get( (&author, community) ).ok_or("Signer not a Member")?;

            if membership.role != Role::Admin {
                return Err("Only the admin can update the membership")
            }

            if author == who && role != Role::Admin && CommunitiesMembers::<T>::get(&community).iter().find(|other|{
                    **other != author && Memberships::<T>::get( (other, &community) )
                            .map(|m| m.role == Role::Admin).unwrap_or_default()
            }).is_none() {
                return Err("The last Admin can't demote themselfes");
            }

            let mut membership = Memberships::<T>::get( (&who, community) ).ok_or("Account not a Member")?;
            membership.updated_at = Self::now();
            membership.role = role;

            Memberships::<T>::insert((&who, community), membership);

            Self::notify(RawEvent::CommunityMembershipChanged(community, who));
            Ok(())
        }


        // ---- Groups

        pub fn create_group(origin, community: CommunityId, metadata: ExternalData, location: Option<Location>) -> Result {
            let who = ensure_signed(origin)?;
            let membership = Memberships::<T>::get( (&who, community) ).ok_or("Not a member of the Community")?;
            if !Communities::exists(community) {
                return Err("Unknown community")
            }

            if membership.role != Role::Admin && membership.role != Role::Organiser {
                return Err("Only the community admins and organisers can create groups")
            }

            let id = Self::next_id().ok_or("Next id overflow")?;
            let now = Self::now();

            Groups::insert(id, Group {
                belongs_to: community,
                created_at: now,
                updated_at: now,
                location: location.unwrap_or_default(),
                metadata
            });

            Memberships::<T>::insert( (&who, id), Membership {
                created_at: now,
                updated_at: now,
                role: Role::Admin,
            });

            GroupsMembers::<T>::insert(id, vec![&who]);
            MembersGroups::<T>::append_or_insert(who, &[id][..]);
            CommunitiesGroups::append_or_insert(community, &[id][..]);

            Self::notify(RawEvent::GroupCreated(community, id));

            Ok(())
        }

        pub fn update_group(origin, id: GroupId, metadata: Option<ExternalData>, location: Option<Location>) -> Result {
            let who = ensure_signed(origin)?;
            let mut group = Groups::get(id).ok_or("Group doesn't exist")?;
            // must be Admin or Organiser of Group or Community this group belongs to
            let _ = Memberships::<T>::get( (&who, id) )
                .and_then(|m| if m.role == Role::Admin { Some(m) } else {None})
                .or_else(||
                    Memberships::<T>::get( (&who, &group.belongs_to) )
                    .and_then(|m: Membership| match m.role {
                            Role::Admin | Role::Organiser => Some(m),
                            _ => None
                        })
                ).ok_or("You are neither a Group-Admin nor Organiser or Admin of the Community")?;

            group.metadata = metadata.unwrap_or(group.metadata);
            group.location = location.unwrap_or(group.location);
            group.updated_at = Self::now();

            Groups::insert(id, group);

            Self::notify(RawEvent::GroupUpdated(id));

            Ok(())
        }

        // pub fn delete_group(origin, group: GroupId) -> Result {
        //     let who = ensure_signed(origin)?;
        //     // + ensure has role admin for group or community
        //     Err("not yet implemented")
        // }

        // ------- Group Membership

        pub fn join_group(origin, id: GroupId) -> Result {
            let who = ensure_signed(origin)?;
            if Memberships::<T>::exists( (&who, id)) {
                return Err("You already have a membership status with the group");
            }

            let now = Self::now();

            Memberships::<T>::insert( (&who, id), Membership {
                updated_at: now,
                created_at: now,
                role: Role::Member,
            });

            GroupsMembers::<T>::append(&id, &[&who][..]);
            MembersGroups::<T>::append_or_insert(&who, &[&id][..]);

            Self::notify(RawEvent::MemberJoinedGroup(id, who));

            Ok(())
        }

        pub fn update_group_membership(origin, id: GroupId, whom: T::AccountId, role: Role) -> Result {
            let who = ensure_signed(origin)?;
            let group = Groups::get(id).ok_or("Group doesn't exist")?;
            let filter = |m: Membership| match m.role {
                Role::Admin | Role::Organiser => Some(m),
                _ => None
            };
            // must be Admin or Organiser of Group or Community this group belongs to
            let _ = Memberships::<T>::get( (&who, id) )
                .and_then(filter)
                .or_else(||
                    Memberships::<T>::get( (&who, &group.belongs_to) )
                    .and_then(filter)
                ).ok_or("You are neither an Admin nor Organiser of the Group or Community")?;


            let mut membership = Memberships::<T>::get( (&whom, id)).ok_or("Is not a member")?;
            membership.role = role;
            membership.updated_at = Self::now();
            Memberships::<T>::insert( (&whom, id), membership);

            Self::notify(RawEvent::GroupMembershipChanged(id, whom));

            Ok(())
        }

        // --- Gatherinigs

        pub fn create_gathering(origin, group_id: GroupId, details: GatheringInput) -> Result {
            let who = ensure_signed(origin)?;
            let group = Groups::get(group_id).ok_or("Group doesn't exist")?;
            let filter = |m: Membership| match m.role {
                Role::Admin | Role::Organiser => Some(m),
                _ => None
            };
            // must be Admin or Organiser of Group or Community this group belongs to
            let _ = Memberships::<T>::get( (&who, group_id) )
                .and_then(filter)
                .or_else(||
                    Memberships::<T>::get( (&who, &group.belongs_to) )
                    .and_then(filter)
                ).ok_or("You are neither an Admin nor Organiser of the Group or Community")?;

            let id = Self::next_id().ok_or("Next id overflow")?;
            let now = Self::now();
            Gatherings::insert(id, details.as_new(group_id, now));
            RSVPs::<T>::insert((&who, id), RSVP {
                created_at: now,
                updated_at: now,
                state: RSVPStates::Yes,
            });

            GatheringsMembers::<T>::insert(id,vec![&who]);
            MembersGatherings::<T>::append_or_insert(&who, &[id][..]);
            GroupsGatherings::append_or_insert(group_id, &[id][..]);

            Self::notify(RawEvent::GatheringCreated(group_id, id));

            Ok(())
        }

        pub fn _update_gathering(origin, _gathering: GatheringId, _metadata: ExternalData) -> Result {
            let _who = ensure_signed(origin)?;
            // + ensure has role admin for gathering or community
            Err("not yet implemented")
        }

        // pub fn delete_gathering(origin, gathering: GatheringId) -> Result {
        //     let who = ensure_signed(origin)?;
        //     // + ensure has role admin for gathering or community
        //     Err("not yet implemented")
        // }

        // ------- Gathering RSVP

        pub fn rsvp_gathering(origin, id: GatheringId, state: RSVPStates) -> Result {
            let who = ensure_signed(origin)?;
            let now = Self::now();
            let gathering =  Gatherings::get(id).ok_or("Don't know that gathering")?;

            if gathering.starts_at <= now {
                return Err("You can't change your RSVP after the event started");
            }
            let rsvp = match RSVPs::<T>::get( (&who, id) ) {
                Some(mut rsvp) => {
                    rsvp.state = state;
                    rsvp.updated_at = now;
                    rsvp
                }
                _ => {

                   if gathering.belongs_to.iter().filter(
                        |group| Memberships::<T>::get( (&who, group) )
                                .map(|m| m.role != Role::Banned).is_some())
                    .next()
                    .is_none() {
                        return Err("Not a Member of the Group");
                    };

                    GatheringsMembers::<T>::append_or_insert(&id, &[&who][..]);
                    MembersGatherings::<T>::append_or_insert(&who, &[&id][..]);
                    RSVP {
                        created_at: now,
                        updated_at: now,
                        state
                    }
                }
            };
           
            // Update an existing gathering
            RSVPs::<T>::insert( (&who, id), rsvp);

            Self::notify(RawEvent::RSVPUpdated(id, who));

            Ok(())
        }

		// We want to inform users about new events
		fn offchain_worker(_now: T::BlockNumber) {
            #[cfg(feature = "std")]    // we only run this is in native, do not bake into wasm
            Self::send_notifications();
		}

	}
}

#[cfg(feature = "std")]
fn make_template_rendered() -> handlebars::Handlebars {
    let mut h = handlebars::Handlebars::new();
    h.register_template_string("emails/html/rsvped",
            include_str!("../../templates/emails/html/rsvped.hbs"));
    h.register_template_string("emails/html/new-gathering",
            include_str!("../../templates/emails/html/new-gathering.hbs"));

    h.register_template_string("emails/titles/rsvped",
            include_str!("../../templates/emails/titles/rsvped.hbs"));
    h.register_template_string("emails/titles/new-gathering",
            include_str!("../../templates/emails/titles/new-gathering.hbs"));

    if let Ok(mut cur) = std::env::current_dir() {
        cur.push("templates");
        if cur.is_dir() {
            // if we have a "templates" dir in the working dir, add it
            h.register_templates_directory(".hbs", cur);
        }
    }

    h
}

// We've moved the  helper functions outside of the main decleration for briefety.
impl<T: Trait> Module<T> {
    fn now() -> Timestamp {
        // FIXME: <timestamp::Module<T>>::now();
        0
    }

    fn notify(ev: RawEvent<T::AccountId>) {
        match ev {
            // we do something special on some events
            RawEvent::GatheringCreated(group_id, gathering_id) => {
                Notifications::<T>::append(
                    &[Notification::GatheringCreated(group_id, gathering_id)][..]);
            },
            RawEvent::RSVPUpdated(ref gather_id, ref user_id) => {
                if RSVPs::<T>::get( (user_id, gather_id)).expect("Always exists").state == RSVPStates::Yes {
                    Notifications::<T>::append(
                        &[Notification::RSVPUpdated(*gather_id, user_id.clone())][..]);
                }
            }
            _ => {}
        }
        Self::deposit_event(ev);
    }

    fn next_id() -> Option<Reference> {
        let id = Nonce::get();
        let id_inc = id.checked_add(1)?;
        Nonce::put(id_inc);
        Some(id)
    }

    #[cfg(feature = "std")]
    fn send_notifications() {
        let get_email = |u_id: &T::AccountId| -> Option<Vec<u8>> {
            runtime_io::local_storage_get(StorageKind::PERSISTENT, format!("email_{}", u_id).as_bytes())
        };
        for n in Notifications::<T>::get() {
            match n {
                Notification::GatheringCreated(group_id, g) => {
                    let gathering = Gatherings::get(&g).expect("Gathering always exists. qed");
                    for email in GroupsMembers::<T>::get(group_id)
                        .iter()
                        .filter(|u| !RSVPs::<T>::exists( (u, &g)))
                        .filter_map(|u| get_email(u))
                    {
                        Self::email(email, "new-gathering", &gathering);
                    }
                }
                Notification::RSVPUpdated(gathering_id, u_id ) => {
                    if let Some(email) = get_email(&u_id) {
                        let gathering = Gatherings::get(gathering_id).expect("Gathering always exists. qed");
                        Self::email(email, "rsvped", &gathering);
                    }
                }
            }
        }
    }


    #[cfg(not(feature = "std"))]
    fn email(_addr: Vec<u8>, tmpl: &str, _gathering: &Gathering) {
        // stub for WASM for now
    }

    #[cfg(feature = "std")]
    fn email(addr: Vec<u8>, tmpl: &str, _gathering: &Gathering) -> Result {
		if let Some(cfg_str) = runtime_io::local_storage_get(StorageKind::PERSISTENT, EMAIL_CONFIG_STORAGE_KEY) {
            if let Ok(config) = serde_json::from_slice::<EmailConfig>(&cfg_str)  {
                if let Ok(mut transport) = make_lettre_transport(config) {
                    let renderer = make_template_rendered();
                    let subject = renderer.render(&format!("emails/subject/{}", tmpl), &"")
                                .map_err(|e| {
                                    println!("rendering subject failed: {}", e);
                                    "subject rendering failed"
                                })?;
                    let html = renderer.render(&format!("emails/html/{}", tmpl), &"")
                                    .map_err(|e| {
                                        println!("rendering email body failed: {}", e);
                                        "body rendering failed"
                                    })?;
                    let email = Email::builder()
                        .to(String::from_utf8(addr).map_err(|e| {
                            println!("Could not read email addr {}", e);
                            "email addr not uf8"
                        })?)
                        .subject(subject)
                        .html(html);
                    transport.send(email).map_err(|e| {
                        println!("Sending email failed: {}", e);
                        "sending email failed"
                    })?;
                }
            }
        }
        Ok(())
    }
}

decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        // Community Events
		CommunityCreated(CommunityId),
        CommunityUpdated(CommunityId),
		CommunityDeleted(CommunityId),
        MemberJoinedCommunity(CommunityId, AccountId),
        CommunityMembershipChanged(CommunityId, AccountId),

        // Group Events
		GroupCreated(CommunityId, GroupId),
        GroupUpdated(GroupId),
		GroupDeleted(GroupId),
        MemberJoinedGroup(GroupId, AccountId),
        GroupMembershipChanged(GroupId, AccountId),

        // Gathering driven events
		GatheringCreated(GroupId, GatheringId),
        GatheringUpdated(GatheringId),
		GatheringDeleted(GatheringId),

        // RSVP
        RSVPUpdated(GatheringId, AccountId),
	}
);

/// tests for this module
#[cfg(test)]
mod tests {
	use super::*;

	use primitives::{H256, Blake2Hasher};
	use support::{impl_outer_origin, assert_ok, assert_err, parameter_types};
	use sr_primitives::{traits::{BlakeTwo256, IdentityLookup}, testing::Header};
	use sr_primitives::weights::Weight;
	use sr_primitives::Perbill;

	impl_outer_origin! {
		pub enum Origin for Test {}
	}

	// For testing the module, we construct most of a mock runtime. This means
	// first constructing a configuration type (`Test`) which `impl`s each of the
	// configuration traits of modules we want to use.
	#[derive(Clone, Eq, PartialEq)]
    #[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
	pub struct Test;
	parameter_types! {
		pub const BlockHashCount: u64 = 250;
		pub const MaximumBlockWeight: Weight = 1024;
		pub const MaximumBlockLength: u32 = 2 * 1024;
		pub const AvailableBlockRatio: Perbill = Perbill::from_percent(75);
	}
	impl system::Trait for Test {
		type Origin = Origin;
		type Call = ();
		type Index = u64;
		type BlockNumber = u64;
		type Hash = H256;
		type Hashing = BlakeTwo256;
		type AccountId = u64;
		type Lookup = IdentityLookup<Self::AccountId>;
		type Header = Header;
		type Event = ();
		type BlockHashCount = BlockHashCount;
		type MaximumBlockWeight = MaximumBlockWeight;
		type MaximumBlockLength = MaximumBlockLength;
		type AvailableBlockRatio = AvailableBlockRatio;
		type Version = ();
	}
	impl Trait for Test {
		type Event = ();
	}

    impl timestamp::Trait for Test {
        /// A timestamp: milliseconds since the unix epoch.
        type Moment = u64;
        type OnTimestampSet = ();
        type MinimumPeriod = ();
    }

	type Gather = Module<Test>;

	// This function basically just builds a genesis storage key/value store according to
	// our desired mockup.
	fn new_test_ext() -> runtime_io::TestExternalities {
		system::GenesisConfig::default().build_storage::<Test>().unwrap().into()
	}

    fn basic_group_setup() -> GroupId{
        let alice = 1u64;
        let bob = 2u64;

        let commuity_id = Nonce::get();
		assert_ok!(Gather::create_community(Origin::signed(alice), b"IPFSLINK".to_vec()));
		assert_ok!(Gather::join_community(Origin::signed(bob), commuity_id));

        let group_id = Nonce::get();
        assert_ok!(Gather::create_group(Origin::signed(alice), commuity_id, b"NEWLINK".to_vec(), None));
        assert_ok!(Gather::join_group(Origin::signed(bob), group_id));

        group_id
    }

	// #[test]
	// fn test_email() {
    //     Gather::email("ben@gnunicorn.org".as_bytes().to_vec(), &Gathering::default());
    // }

	#[test]
	fn full_regular_flow() {
		new_test_ext().execute_with(|| {

            let alice = 1u64;
            let bob = 2u64;
            let next_community = Nonce::get();
            let soon = Gather::now() + 10000;

			assert_ok!(Gather::create_community(Origin::signed(alice), b"IPFSLINK".to_vec()));
            let community = Communities::get(next_community).unwrap();
			assert_eq!(community.metadata, b"IPFSLINK".to_vec());
			assert_eq!(CommunitiesMembers::<Test>::get(next_community), vec![alice]);
			assert_eq!(MembersCommunities::<Test>::get(alice), vec![next_community]);

            let a_membership = Memberships::<Test>::get((alice, next_community)).unwrap();
            assert_eq!(a_membership.role, Role::Admin);

            assert_eq!(Memberships::<Test>::get((bob, next_community)), None);
			assert_ok!(Gather::join_community(Origin::signed(bob), next_community));
			assert_eq!(CommunitiesMembers::<Test>::get(next_community), vec![alice, bob]);
			assert_eq!(MembersCommunities::<Test>::get(bob), vec![next_community]);

            let b_membership = Memberships::<Test>::get((bob, next_community)).unwrap();
            assert_eq!(b_membership.role, Role::Member);

            // let's create some group
            let mut next_group = Reference::default();
            for _ in 0..3 {
                next_group = Nonce::get();
                assert_ok!(Gather::create_group(Origin::signed(alice), next_community, b"NEWLINK".to_vec(), None));
                let group = Groups::get(next_group).unwrap();
                assert_eq!(group.metadata, b"NEWLINK".to_vec());
                assert_eq!(group.belongs_to, next_community);
                assert_eq!(GroupsMembers::<Test>::get(next_group), vec![alice]);
                assert_eq!(MembersGroups::<Test>::get(alice).contains(&next_group), true);

                let a_membership = Memberships::<Test>::get((alice, next_group)).unwrap();
                assert_eq!(a_membership.role, Role::Admin);

            }

            // create some event:
            let next_event = Nonce::get();
            assert_ok!(Gather::create_gathering(Origin::signed(alice), next_group, GatheringInput::then(soon)));
            let gathering = Gatherings::get(next_event).unwrap();
            assert_eq!(gathering.belongs_to, vec![next_group]);

            assert_eq!(GatheringsMembers::<Test>::get(next_event), vec![alice]);
            assert_eq!(MembersGatherings::<Test>::get(alice), vec![next_event]);

            let rsvp = RSVPs::<Test>::get((alice, next_event)).unwrap();
            assert_eq!(rsvp.state, RSVPStates::Yes);

            // Let's update that

            assert_ok!(Gather::rsvp_gathering(Origin::signed(alice), next_event, RSVPStates::No));
            let rsvp = RSVPs::<Test>::get((alice, next_event)).unwrap();
            assert_eq!(rsvp.state, RSVPStates::No);

            // and if bob tried that? fails beccause he ain't a member
            assert_err!(Gather::rsvp_gathering(Origin::signed(bob), next_event, RSVPStates::No), "Not a Member of the Group");

            assert_eq!(GatheringsMembers::<Test>::get(next_event), vec![alice]);
            assert_eq!(MembersGatherings::<Test>::get(bob).len(), 0);

            let rsvp = RSVPs::<Test>::get((bob, next_event));
            assert_eq!(rsvp.is_none(), true);

            // but if he joined

            assert_ok!(Gather::join_group(Origin::signed(bob), next_group));
            assert_eq!(GroupsMembers::<Test>::get(next_group), vec![alice, bob]);
            assert_eq!(MembersGroups::<Test>::get(bob), vec![next_group]);

            let b_membership = Memberships::<Test>::get((bob, next_group)).unwrap();
            assert_eq!(b_membership.role, Role::Member);

            // and then tried again

            assert_ok!(Gather::rsvp_gathering(Origin::signed(bob), next_event, RSVPStates::No));

            assert_eq!(GatheringsMembers::<Test>::get(next_event), vec![alice, bob]);
            assert_eq!(MembersGatherings::<Test>::get(bob), vec![next_event]);

            let rsvp = RSVPs::<Test>::get((bob, next_event)).unwrap();
            assert_eq!(rsvp.state, RSVPStates::No);
			
		});
	}


	#[test]
	fn new_gatherings_creates_offchain_notifications() {
		new_test_ext().execute_with(|| {

            let alice = 1u64;
            let bob = 2u64;
            let soon = Gather::now() + 10000;
            let group_id = basic_group_setup();
            let gathering_id = Nonce::get();

            Notifications::<Test>::kill(); // clean up all existing events
            
            assert_ok!(Gather::create_gathering(Origin::signed(alice), group_id, GatheringInput::then(soon)));
            let gathering = Gatherings::get(gathering_id).unwrap();

            assert_eq!(Gather::who_to_notify(), vec![(bob, gathering)]);
        });
    }

	#[test]
	fn permissions() {
		new_test_ext().execute_with(|| {

            let alice = 1u64;
            let bob = 2u64;
            let charly = 3u64;
            let dave = 4u64;
            let community = Nonce::get();

            let soon = Gather::now() + 10000;

			assert_ok!(Gather::create_community(Origin::signed(alice), b"IPFSLINK".to_vec()));
			assert_ok!(Gather::join_community(Origin::signed(bob), community));
			assert_ok!(Gather::join_community(Origin::signed(charly), community));
			assert_ok!(Gather::join_community(Origin::signed(dave), community));

            assert_eq!(Memberships::<Test>::get((alice, community)).unwrap().role, Role::Admin);
            assert_eq!(Memberships::<Test>::get((bob, community)).unwrap().role, Role::Member);
            assert_eq!(Memberships::<Test>::get((charly, community)).unwrap().role, Role::Member);
            assert_eq!(Memberships::<Test>::get((dave, community)).unwrap().role, Role::Member);

			assert_err!(Gather::update_community(Origin::signed(bob), community, b"NewLink".to_vec()), "Only the admin can update the group info");
			assert_err!(Gather::create_group(Origin::signed(bob), community, b"NewLink".to_vec(), None), "Only the community admins and organisers can create groups");

            // bob can't set it
			assert_err!(Gather::update_community_membership(Origin::signed(bob), community, bob, Role::Moderator), "Only the admin can update the membership");
            // but alice can
			assert_ok!(Gather::update_community_membership(Origin::signed(alice), community, bob, Role::Moderator));
            // still not enough to update the community or create a group
			assert_err!(Gather::update_community(Origin::signed(bob), community, b"NewLink".to_vec()), "Only the admin can update the group info");
			assert_err!(Gather::create_group(Origin::signed(bob), community, b"NewLink".to_vec(), None), "Only the community admins and organisers can create groups");

            // so let's bump up again
			assert_ok!(Gather::update_community_membership(Origin::signed(alice), community, bob, Role::Organiser));
            // Organiser still not be allowed to update the community
			assert_err!(Gather::update_community(Origin::signed(bob), community, b"NewLink".to_vec()), "Only the admin can update the group info");
            // but create a Group

            let group = Nonce::get();
			assert_ok!(Gather::create_group(Origin::signed(bob), community, b"NewGroup".to_vec(), None));
            assert_ok!(Gather::join_group(Origin::signed(charly), group));
            assert_ok!(Gather::join_group(Origin::signed(dave), group));

			assert_err!(Gather::update_group(Origin::signed(charly), group, Some(b"NewLink".to_vec()), None), "You are neither a Group-Admin nor Organiser or Admin of the Community");
			assert_err!(Gather::create_gathering(Origin::signed(charly), group, GatheringInput::then(soon)), "You are neither an Admin nor Organiser of the Group or Community");
            assert_err!(Gather::update_group_membership(Origin::signed(charly), group, charly, Role::Admin), "You are neither an Admin nor Organiser of the Group or Community");

            // but bob can
            assert_ok!(Gather::update_group_membership(Origin::signed(bob), group, charly, Role::Admin));
            // and so can alice, the admin of the Organisation, though not in the Group themselves
            assert_ok!(Gather::update_group_membership(Origin::signed(alice), group, charly, Role::Organiser));

            // and as an organiser Charly can create gatherings
			assert_ok!(Gather::create_gathering(Origin::signed(charly), group, GatheringInput::then(soon)));
            // but not update the info.
			assert_err!(Gather::update_group(Origin::signed(charly), group, Some(b"NewInfo".to_vec()), None), "You are neither a Group-Admin nor Organiser or Admin of the Community");

            // even after alice joined as a regular member
            assert_ok!(Gather::join_group(Origin::signed(alice), group));
            // she can still excercise admin rights
			assert_ok!(Gather::update_group(Origin::signed(alice), group, Some(b"Latest Update".to_vec()), None));
        });
    }

	#[test]
	fn last_community_admin_cant_demote() {
		new_test_ext().execute_with(|| {

            let alice = 1u64;
            let community = Nonce::get();

			assert_ok!(Gather::create_community(Origin::signed(alice), b"IPFSLINK".to_vec()));
			assert_err!(Gather::update_community_membership(Origin::signed(alice), community, alice, Role::Moderator), "The last Admin can\'t demote themselfes");
			assert_err!(Gather::update_community_membership(Origin::signed(alice), community, alice, Role::Organiser), "The last Admin can\'t demote themselfes");
			assert_err!(Gather::update_community_membership(Origin::signed(alice), community, alice, Role::Member), "The last Admin can\'t demote themselfes");
        });
    }

}