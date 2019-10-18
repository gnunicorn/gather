#![cfg_attr(not(feature = "std"), no_std)]

use rstd::prelude::*;
use support::{decl_module, decl_storage, decl_event, dispatch::Result};
use system::ensure_signed;
use codec::{Encode, Decode};

// TYPES
pub type Reference = u128;
pub type CommunityId = Reference;
pub type GroupId = Reference;
pub type GatheringId = Reference;
pub type ExternalData = Vec<u8>; //potentially IPFS CiD
pub type Location = (u128, u128); // Latitude, Langitude?
pub type Timezone = u8;
/// UTC epoch time
pub type Timestamp = u64; 

/// We have multiple ways to define and understand a location
#[derive(Encode, Decode, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub enum GroupLocation {
    /// This is a globally acting group, events are everywhere or nowhere
    Global,
    /// This is a remote acting group, but bound to a base timezone
    Remote(Option<Timezone>),
    /// This group is bound to a specific location or Region?
    Local(Location),
}

/// The role attachted to a specific Membership between Account
/// and either Group or Community, by increasing privileges
#[derive(Encode, Decode, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub enum Role {
    /// Regular Member
    Member,
    /// + Can manage content from members - edit and delete
    Moderator, // saved for later
    /// + Can create and edit gatherings, organise waiting lists
    Organiser, 
    /// + Can edit group/community info, change roles of other users
    Admin,
    /// + Can delete group/commiunity info, manage access levels
    Owner,
}

/// The Community Definition
#[derive(Encode, Decode, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Community {
    /// Title, description and alike are move off chain
    pub metadata: ExternalData,
    /// when was this created?
    pub created_at: Timestamp,
    /// when last updated?
    pub updated_at: Timestamp,
}

/// This is a Group
#[derive(Encode, Decode, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Group {
    /// Which community does this group belong to
    pub belongs_to: CommunityId,
    /// Where is this group "located"
    pub location: GroupLocation,
    /// Further user informational group info
    pub metadata: ExternalData,
    /// when was this created?
    pub created_at: Timestamp,
    /// when last updated?
    pub updated_at: Timestamp,
}

/// Definition for a specific Gathering
#[derive(Encode, Decode, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Gathering {
    pub belongs_to: Vec<GroupId>,
    /// Where does this take place?
    pub location: GroupLocation,
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
#[derive(Encode, Decode, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Membership {
    pub role: Role,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

#[derive(Encode, Decode, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub enum RSVPStates {
    Yes,
    No,
    Maybe,
    Waitinglist,
}

#[derive(Encode, Decode, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct RSVP {
    pub state: RSVPStates,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}


/// The module's configuration trait.
pub trait Trait: system::Trait {
	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

// This module's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as Gather
    {
		Communities: map CommunityId => Option<Community>;
        CommunitiesMembers: map CommunityId => Vec<T::AccountId>;
        MembersCommunities: map T::AccountId => Vec<CommunityId>;
        CommunitiesGroups: map CommunityId => Vec<GroupId>;

		Groups: map GroupId => Option<Group>;
        GroupsMembers: map GroupId => Vec<T::AccountId>;
        MembersGroups: map T::AccountId => Vec<GroupId>;
        GroupsGatherings: map GroupId => Vec<GatheringId>;

        Gatherings: map GatheringId => Option<Gathering>;
        GatheringsMembers: map GatheringId => Vec<T::AccountId>;
        MembersGatherings: map T::AccountId => Vec<GatheringId>;

        Memberships: map (T::AccountId, Reference) => Option<Membership>;
        RSVPs: map (T::AccountId, GatheringId) => Option<RSVP>;

        // nonces
        CommunitiesNonce: Reference;
        GroupsNonce: Reference;
        GatheringsNonce: Reference;
    }
}

// The module's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		fn deposit_event() = default;

        pub fn create_community(origin, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            Err("not yet implemented")
        }

        pub fn update_community(origin, community: CommunityId, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin
            Err("not yet implemented")
        }

        pub fn join_community(origin, group: CommunityId) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure not yet member
            Err("not yet implemented")
        }

        pub fn delete_community(origin, community: CommunityId) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin
            Err("not yet implemented")
        }

        pub fn create_group(origin, community: CommunityId, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure who has admin rights for community
            Err("not yet implemented")
        }

        pub fn update_group(origin, group: GroupId, metadata: ExternalData) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin for group or community
            Err("not yet implemented")
        }

        pub fn delete_group(origin, group: GroupId) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin for group or community
            Err("not yet implemented")
        }

        pub fn join_group(origin, group: GroupId) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure not yet member
            Err("not yet implemented")
        }

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

        pub fn delete_gathering(origin, gathering: GatheringId) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure has role admin for gathering or community
            Err("not yet implemented")
        }

        pub fn rsvp_gathering(origin, gathering: GatheringId, rsvp: RSVPStates) -> Result {
            let who = ensure_signed(origin)?;
            // + ensure are a member
            // create or update
            Err("not yet implemented")
        }

	}
}

decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        // Community Events
		CommunityCreated(Reference),
        CommunityUpdated(Reference),
		CommunityDeleted(Reference),
        MemberJoinedCommunity(Reference, AccountId),
        CommunityMembershipChanged(Reference, AccountId),

        // Group Events
		GroupCreated(Reference),
        GroupUpdated(Reference),
		GroupDeleted(Reference),
        MemberJoinedGroup(Reference, AccountId),
        GroupMembershipChanged(Reference, AccountId),

        // Gathering driven events
		GatheringCreated(Reference),
        GatheringUpdated(Reference),
		GatheringDeleted(Reference),

        // RSVP
        MemberRSVPed(Reference, AccountId),
        RSVPUpdated(Reference, AccountId),
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
#[cfg_attr(feature = "std", derive(Debug))]
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
            let next_community = CommunitiesNonce::get();

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
            assert_eq!(a_membership.role, Role::Member);

            // let's create some group
            let mut next_group = GroupsNonce::get();
            for _ in 0..3 {
                assert_ok!(Gather::create_group(Origin::signed(alice), next_community, b"NEWLINK".to_vec()));
                let group = Groups::get(next_group).unwrap();
                assert_eq!(group.metadata, b"NEWLINK".to_vec());
                assert_eq!(group.belongs_to, next_community);
                assert_eq!(GroupsMembers::<Test>::get(next_group), vec![alice]);
                assert_eq!(MembersGroups::<Test>::get(alice), vec![next_group]);

                let a_membership = Memberships::<Test>::get((alice, next_group)).unwrap();
                assert_eq!(a_membership.role, Role::Admin);

                next_group = GroupsNonce::get();
            }

            // create some event:
            let mut next_event = GatheringsNonce::get();
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
            assert_eq!(MembersGatherings::<Test>::get(bob), vec![]);

            let rsvp = RSVPs::<Test>::get((bob, next_event));
            assert_eq!(rsvp.is_none(), true);

            // but if he joined

            assert_ok!(Gather::join_group(Origin::signed(bob), next_group));
            assert_eq!(GroupsMembers::<Test>::get(next_group), vec![alice, bob]);
            assert_eq!(MembersGroups::<Test>::get(bob), vec![next_group]);

            let b_membership = Memberships::<Test>::get((bob, next_group)).unwrap();
            assert_eq!(a_membership.role, Role::Member);

            // and then tried again

            assert_err!(Gather::rsvp_gathering(Origin::signed(bob), next_event, RSVPStates::No), "");

            assert_eq!(GatheringsMembers::<Test>::get(next_event), vec![alice, bob]);
            assert_eq!(MembersGatherings::<Test>::get(bob), vec![next_event]);

            let rsvp = RSVPs::<Test>::get((bob, next_event)).unwrap();
            assert_eq!(rsvp.state, RSVPStates::Yes);
			
		});
	}
}
