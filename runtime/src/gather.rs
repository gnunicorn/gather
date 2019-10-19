#![cfg_attr(not(feature = "std"), no_std)]

use rstd::prelude::*;
use support::{decl_module, decl_storage, decl_event, dispatch::Result};
use system::ensure_signed;
use codec::{Encode, Decode};

#[cfg(feature = "std")]
use serde::{Serialize, Deserialize};

// TYPES
pub type Reference = u64;
pub type CommunityId = Reference;
pub type GroupId = Reference;
pub type GatheringId = Reference;
pub type ExternalData = Vec<u8>; //potentially IPFS CiD
pub type LatLang = (u64, u64); // Latitude, Langitude?
pub type Timezone = u8;
/// UTC epoch time
pub type Timestamp = u64; 

/// We have multiple ways to define and understand a location
#[derive(Encode, Decode, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
pub enum Location {
    /// This is a globally acting group, events are everywhere or nowhere
    Global,
    /// This is a remote acting group, but bound to a base timezone
    Remote(Option<Timezone>),
    /// This group is bound to a specific location or Region?
    Local(LatLang),
}

impl Default for Location {
    fn default() -> Self { Location::Global }
}

/// The role attachted to a specific Membership between Account
/// and either Group or Community, by increasing privileges
#[derive(Encode, Decode, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
pub enum Role {
    /// Regular Member
    Member,
    /// + Can manage content from members - edit and delete
    Moderator, // saved for later
    /// + Can create and edit gatherings, organise waiting lists
    Organiser, 
    /// + Can edit group/community info, change roles of other users
    Admin
}

impl Default for Role {
    fn default() -> Self { Role::Member }
}

#[derive(Encode, Decode, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
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
#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
pub struct Community {
    /// Title, description and alike are move off chain
    pub metadata: ExternalData,
    /// when was this created?
    pub created_at: Timestamp,
    /// when last updated?
    pub updated_at: Timestamp,
}

/// This is a Group
#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
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
#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
pub struct Gathering {
    pub belongs_to: Vec<GroupId>,
    /// Where does this take place?
    pub location: Location,
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

/// Define the Roles and thus privileges of a specific member
#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
pub struct Membership {
    pub role: Role,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
pub struct RSVP {
    pub state: RSVPStates,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}


/// The module's configuration trait.
pub trait Trait: system::Trait + timestamp::Trait {
	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
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

        Memberships get(memberships): map (T::AccountId, Reference) => Option<Membership>;
        RSVPs get(rsvps): map (T::AccountId, GatheringId) => Option<RSVP>;

        // nonces
        Nonce get(nonce) config(): Reference;
    }
}

// The module's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		fn deposit_event() = default;

        // ---- Community

        pub fn create_community(origin, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            let id = Self::next_id();
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

            Self::deposit_event(RawEvent::CommunityCreated(id));

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

            Self::deposit_event(RawEvent::CommunityUpdated(id));
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

            Self::deposit_event(RawEvent::CommunityMembershipChanged(id, who));

            Ok(())
        }

        pub fn update_community_membership(origin, community: CommunityId, who: T::AccountId, role: Role) -> Result {
            let author = ensure_signed(origin)?;
            let membership = Memberships::<T>::get( (&author, community) ).ok_or("Signer not a Member")?;

            if membership.role != Role::Admin {
                return Err("Only the admin can update the membership")
            }

            let mut membership = Memberships::<T>::get( (&who, community) ).ok_or("Account not a Member")?;
            membership.updated_at = Self::now();
            membership.role = role;

            Memberships::<T>::insert((&who, community), membership);

            Self::deposit_event(RawEvent::CommunityMembershipChanged(community, who));
            Ok(())
        }


        // ---- Groups

        pub fn create_group(origin, community: CommunityId, metadata: ExternalData, location: Option<Location>) -> Result {
            let who = ensure_signed(origin)?;
            let membership = Memberships::<T>::get( (&who, community) ).ok_or("Not a member of the Community")?;
            if !Communities::exists(community) {
                return Err("Unknown community")
            }

            if membership.role != Role::Admin {
                return Err("Only the community admins can create groups")
            }

            let id = Self::next_id();
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


            Self::deposit_event(RawEvent::GroupCreated(community, id));

            Ok(())
        }

        pub fn update_group(origin, group: GroupId, metadata: Option<ExternalData>, location: Option<Location>) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin for group or community
            Err("not yet implemented")
        }

        // pub fn delete_group(origin, group: GroupId) -> Result {
        //     let who = ensure_signed(origin)?;
        //     // + ensure has role admin for group or community
        //     Err("not yet implemented")
        // }

        // ------- Group Membership

        pub fn join_group(origin, group: GroupId) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure not yet member
            Err("not yet implemented")
        }

        pub fn update_group_membership(origin, group: GroupId, who: T::AccountId, role: Role) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin
            Err("not yet implemented")
        }

        // --- Gatherinigs

        pub fn create_gathering(origin, group: GroupId, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure who has admin rights for community
            Err("not yet implemented")
        }

        pub fn update_gathering(origin, gathering: GatheringId, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin for gathering or community
            Err("not yet implemented")
        }

        // pub fn delete_gathering(origin, gathering: GatheringId) -> Result {
        //     let who = ensure_signed(origin)?;
        //     // + ensure has role admin for gathering or community
        //     Err("not yet implemented")
        // }

        // ------- Gathering RSVP

        pub fn rsvp_gathering(origin, gathering: GatheringId, rsvp: RSVPStates) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure are a member
            // create or update
            Err("not yet implemented")
        }

	}
}

// We've moved the  helper functions outside of the main decleration for briefety.
impl<T: Trait> Module<T> {
    fn now() -> Timestamp {
        // FIXME: <timestamp::Module<T>>::now();
        0
    }
    fn next_id() -> Reference {
        let id = Nonce::get();
        Nonce::put(id + 1); //FIXME: COULD OVERFLOW
        id
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
        MemberRSVPed(GatheringId, AccountId),
        RSVPUpdated(GatheringId, AccountId),
	}
);

/// tests for this module
#[cfg(test)]
mod tests {
	use super::*;

	use runtime_io::with_externalities;
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
		type WeightMultiplierUpdate = ();
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
	fn new_test_ext() -> runtime_io::TestExternalities<Blake2Hasher> {
		system::GenesisConfig::default().build_storage::<Test>().unwrap().into()
	}

	#[test]
	fn full_regular_flow() {
		with_externalities(&mut new_test_ext(), || {

            let alice = 1u64;
            let bob = 2u64;
            let next_community = Nonce::get();

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
            let mut next_group = Nonce::get();
            for _ in 0..3 {
                assert_ok!(Gather::create_group(Origin::signed(alice), next_community, b"NEWLINK".to_vec(), None));
                let group = Groups::get(next_group).unwrap();
                assert_eq!(group.metadata, b"NEWLINK".to_vec());
                assert_eq!(group.belongs_to, next_community);
                assert_eq!(GroupsMembers::<Test>::get(next_group), vec![alice]);
                assert_eq!(MembersGroups::<Test>::get(alice).contains(&next_group), true);

                let a_membership = Memberships::<Test>::get((alice, next_group)).unwrap();
                assert_eq!(a_membership.role, Role::Admin);

                next_group = Nonce::get();
            }

            // create some event:
            let next_event = Nonce::get();
            assert_ok!(Gather::create_gathering(Origin::signed(alice), next_group, b"EVENTLINK".to_vec()));
            let gathering = Gatherings::get(next_event).unwrap();
            assert_eq!(gathering.metadata, b"EVENTLINK".to_vec());
            assert_eq!(gathering.belongs_to, vec![next_group]);

            assert_eq!(GatheringsMembers::<Test>::get(next_event), vec![alice]);
            assert_eq!(MembersGatherings::<Test>::get(alice), vec![next_event]);

            let rsvp = RSVPs::<Test>::get((alice, next_event)).unwrap();
            assert_eq!(rsvp.state, RSVPStates::Yes);

            // Let's update that

            assert_ok!(Gather::rsvp_gathering(Origin::signed(alice), next_event, RSVPStates::No));
            let rsvp = RSVPs::<Test>::get((alice, next_event)).unwrap();
            assert_eq!(rsvp.state, RSVPStates::Yes);

            // and if bob tried that? fails beccause he ain't a member
            assert_err!(Gather::rsvp_gathering(Origin::signed(bob), next_event, RSVPStates::No), "");

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

            assert_err!(Gather::rsvp_gathering(Origin::signed(bob), next_event, RSVPStates::No), "");

            assert_eq!(GatheringsMembers::<Test>::get(next_event), vec![alice, bob]);
            assert_eq!(MembersGatherings::<Test>::get(bob), vec![next_event]);

            let rsvp = RSVPs::<Test>::get((bob, next_event)).unwrap();
            assert_eq!(rsvp.state, RSVPStates::Yes);
			
		});
	}

	#[test]
	fn permissions() {
		with_externalities(&mut new_test_ext(), || {

            let alice = 1u64;
            let bob = 2u64;
            let charly = 3u64;
            let dave = 4u64;
            let community = Nonce::get();

			assert_ok!(Gather::create_community(Origin::signed(alice), b"IPFSLINK".to_vec()));
			assert_ok!(Gather::join_community(Origin::signed(bob), community));
			assert_ok!(Gather::join_community(Origin::signed(charly), community));
			assert_ok!(Gather::join_community(Origin::signed(dave), community));

            assert_eq!(Memberships::<Test>::get((alice, community)).unwrap().role, Role::Admin);
            assert_eq!(Memberships::<Test>::get((bob, community)).unwrap().role, Role::Member);
            assert_eq!(Memberships::<Test>::get((charly, community)).unwrap().role, Role::Member);
            assert_eq!(Memberships::<Test>::get((dave, community)).unwrap().role, Role::Member);

			assert_err!(Gather::update_community(Origin::signed(bob), community, b"NewLink".to_vec()), "");
			assert_err!(Gather::create_group(Origin::signed(bob), community, b"NewLink".to_vec(), None), "");

            // bob can't set it
			assert_err!(Gather::update_community_membership(Origin::signed(bob), community, bob, Role::Moderator), "");
            // but alice can
			assert_ok!(Gather::update_community_membership(Origin::signed(alice), community, bob, Role::Moderator));
            // still not enough to update the community or create a group
			assert_err!(Gather::update_community(Origin::signed(bob), community, b"NewLink".to_vec()), "");
			assert_err!(Gather::create_group(Origin::signed(bob), community, b"NewLink".to_vec(), None), "");

            // so let's bump up again
			assert_ok!(Gather::update_community_membership(Origin::signed(alice), community, bob, Role::Organiser));
            // Organiser still not be allowed to update the community
			assert_err!(Gather::update_community(Origin::signed(bob), community, b"NewLink".to_vec()), "");
            // but create a Group

            let group = Nonce::get();
			assert_ok!(Gather::create_group(Origin::signed(bob), community, b"NewGroup".to_vec(), None));
            assert_ok!(Gather::join_group(Origin::signed(charly), group));
            assert_ok!(Gather::join_group(Origin::signed(dave), group));

			assert_err!(Gather::update_group(Origin::signed(charly), group, Some(b"NewLink".to_vec()), None), "");
			assert_err!(Gather::create_gathering(Origin::signed(charly), group, b"NewLink".to_vec()), "");
            assert_err!(Gather::update_group_membership(Origin::signed(charly), group, charly, Role::Admin), "");

            // but bob can
            assert_err!(Gather::update_group_membership(Origin::signed(bob), group, charly, Role::Admin), "");
            // and so can alice, the admin of the Organisation, though not in the Group themselves
            assert_err!(Gather::update_group_membership(Origin::signed(alice), group, charly, Role::Organiser), "");

            // and as an organiser Charly can create gatherings
			assert_ok!(Gather::create_gathering(Origin::signed(charly), group, b"NewInfo".to_vec()));
            // but not update the info.
			assert_err!(Gather::update_group(Origin::signed(charly), group, Some(b"NewInfo".to_vec()), None), "");

            // even after alice joined as a regular member
            assert_ok!(Gather::join_group(Origin::signed(alice), group));
            // she can still excercise admin rights
			assert_ok!(Gather::update_group(Origin::signed(alice), group, Some(b"Latest Update".to_vec()), None));
        });
    }

	#[test]
	fn last_community_admin_cant_demote() {
		with_externalities(&mut new_test_ext(), || {

            let alice = 1u64;
            let community = Nonce::get();

			assert_ok!(Gather::create_community(Origin::signed(alice), b"IPFSLINK".to_vec()));
			assert_err!(Gather::update_community_membership(Origin::signed(alice), community, alice, Role::Moderator), "");
			assert_err!(Gather::update_community_membership(Origin::signed(alice), community, alice, Role::Organiser), "");
			assert_err!(Gather::update_community_membership(Origin::signed(alice), community, alice, Role::Member), "");
        });
    }

}
