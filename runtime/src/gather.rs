#![cfg_attr(not(feature = "std"), no_std)]

use rstd::prelude::*;
use support::{decl_module, decl_storage, decl_event, dispatch::Result};
use system::ensure_signed;
use balances::{self, Module as Balances};
use support::traits::Currency;
use sr_primitives::{
	traits::CheckedSub,
	weights::SimpleDispatchInfo,
};

// TYPES
pub type RefId<B as Block> = B::Hash;
pub type CommunityId<B> = RefId<B>;
pub type GroupId<B> = RefId<B>;
pub type GatheringId<B> = RefId<B>;
pub type ExternalData = Vec<u8>; //potentially IPFS CiD
pub type Location = (u128, u128); // Latitude, Langitude?
pub type Timezone = u8;

/// We have multiple ways to define and understand a location
pub enum GroupLocation {
    /// This is a globally acting group, events are everywhere or nowhere
    Global,
    /// This is a remote acting group, but bound to a base timezone
    Remote(Option<Timezone>),
    /// This group is bound to a specific location or Region?
    Local(Location)
}

/// The role attachted to a specific Membership between Account
/// and either Group or Community, by increasing privileges
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
pub struct Community {
    /// Title, description and alike are move off chain
    pub metadata: ExternalData,
    /// when was this created?
    pub created_at: Timestamp,
    /// when last updated?
    pub updated_at: Timestamp,
}

/// This is a Group
pub struct Group<B> {
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

pub struct Gathering {
    pub belomgs_to: Vec<GroupId>,
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
pub struct Membership {
    pub role: Role,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

pub enum RSVPStates {
    Yes,
    No,
    Maybe,
    Waitinglist,
}

pub RSVP {
    pub state: RSVPStates,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}


/// The module's configuration trait.
pub trait Trait: system::Trait + balances::Trait {
	// TODO: Add other types and constants required configure this module.

	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

// This module's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as Gather {
		Community: map CommunityId => Community;
        CommunityMembers: map CommunityId => Vec<T::AccountId>;
        MemberCommunities: map T::AccountId => Vec<CommunityId>;
        CommunityGroups: map CommunityId => Vec<GroupId>;

		Group: map GroupId => Group;
        GroupMembers: map GroupId => Vec<T::AccountId>;
        MemberGroups: map T::AccountId => Vec<GroupId>;
        GroupGatherings: map GroupId => Vec<GatheringId>;

        Gathering: map GatheringId => Gathering;
        GatheringMembers: map GatheringId => Vec<T:AccountId>;
        MemberGatherings: map T::AccountId => Vec<GatheringId>;

        Memberships: map (T::AccountId, RefId) => Membership;
        RSVPs: map (T::AccountId, GatheringId) => RSVP;

        CommunityNonce: u128;
        GroupNonce: u128;
        GatheringNonce: u128;
	}
}

// The module's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		fn deposit_event() = default;

        pub fn create_community(origin, metadata: ExternalData) -> Result {
            let who = ensure_signed!(origin)?;
        }

        pub fn update_community(origin, community: CommunityId, metadata: ExternalData) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure has role admin
        }

        pub fn join_community(origin, group: CommunityId) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure not yet member
        }

        pub fn delete_community(origin, community: CommunityId) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure has role admin
        }

        pub fn create_group(origin, community: CommunityId, metadata: ExternalData) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure who has admin rights for community
        }

        pub fn update_group(origin, group: GroupId, metadata: ExternalData) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure has role admin for group or community
        }

        pub fn delete_group(origin, group: GroupId) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure has role admin for group or community
        }

        pub fn join_group(origin, group: GroupId) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure not yet member
        }

        pub fn create_gathering(origin, group: GroupId, metadata: ExternalData) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure who has admin rights for community
        }

        pub fn update_gathering(origin, gathering: GatheringId, metadata: ExternalData) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure has role admin for gathering or community
        }

        pub fn delete_gathering(origin, gathering: GatheringId) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure has role admin for gathering or community
        }

        pub fn rsvp_gathering(origin, gathering: GatheringId, rsvp: RSVPStates) -> Result {
            let who = ensure_signed!(origin)?;
            // + ensure are a member
            // create or update
        }

	}
}

decl_event!(git
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		// Just a dummy event.
		// Event `Something` is declared with a parameter of the type `u32` and `AccountId`
		// To emit this event, we call the deposit funtion, from our runtime funtions
		SomethingStored(u32, AccountId),
	}
);

/// tests for this module
#[cfg(test)]
mod tests {
	use super::*;

	use runtime_io::with_externalities;
	use primitives::{H256, Blake2Hasher};
	use support::{impl_outer_origin, assert_ok, parameter_types};
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
	type Haski = Module<Test>;

	// This function basically just builds a genesis storage key/value store according to
	// our desired mockup.
	fn new_test_ext() -> runtime_io::TestExternalities<Blake2Hasher> {
		system::GenesisConfig::default().build_storage::<Test>().unwrap().into()
	}

	#[test]
	fn it_works_for_default_value() {
		with_externalities(&mut new_test_ext(), || {
			// Just a dummy test for the dummy funtion `do_something`
			// calling the `do_something` function with a value 42
			assert_ok!(Haski::do_something(Origin::signed(1), 42));
			// asserting that the stored value is equal to what we stored
			assert_eq!(Haski::something(), Some(42));
		});
	}
}
