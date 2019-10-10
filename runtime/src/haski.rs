/// A runtime module template with necessary imports

/// Feel free to remove or edit this file as needed.
/// If you change the name of this file, make sure to update its references in runtime/src/lib.rs
/// If you remove this file, you can remove those references


/// For more guidance on Substrate modules, see the example module
/// https://github.com/paritytech/substrate/blob/master/srml/example/src/lib.rs

use support::{decl_module, decl_storage, decl_event, dispatch::Result};
use system::ensure_signed;
use balances::{self, Module as Balances};
use support::traits::Currency;
use sr_primitives::{
	traits::{CheckedSub, CheckedMul},
	weights::SimpleDispatchInfo,
};

/// The module's configuration trait.
pub trait Trait: system::Trait + balances::Trait {
	// TODO: Add other types and constants required configure this module.

	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

// This module's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as Haski {
		Faucets get(faucets): map T::AccountId => Option<T::Balance>;
	}
}

// The module's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		// Initializing events
		// this is needed only if you are using events in your module
		fn deposit_event() = default;

		pub fn open_faucet(origin, limit: T::Balance) -> Result {
			let who = ensure_signed(origin)?;

			Faucets::<T>::insert(&who, limit);
			Ok(())
		}

		/// Just is a super simplistic faucet, that gives any new account a minimum BALANCE.
		/// This is only for testing environments AND SHOULD NEVER BE DEPLOYED ANYWHERE.
		#[weight = SimpleDispatchInfo::FreeOperational]
		pub fn faucet(origin, source: T::AccountId) -> Result {
			let target = ensure_signed(origin)?;
			// TODO: You only need this if you want to check it was signed.
			let to_transfer = match <Balances<T> as Currency<T::AccountId>>::minimum_balance().checked_mul(&T::Balance::from(10)){
				None => return Err("Could not calc faucet"),
				Some(b) => b,
			};
			let source_limit = match Self::faucets(&source) {
				None => return Err("Source doesn't have an open faucet"),
				Some(b) => b,
			};
			let new_limit = match source_limit.checked_sub(&to_transfer) {
				None => return Err("would drive limit too low"),
				Some(b) => b,
			};

			let _ = <Balances<T> as Currency<T::AccountId>>::transfer(&source, &target, to_transfer)?;
			Faucets::<T>::insert(&source, new_limit);
			Ok(())
		}
	}
}

decl_event!(
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
