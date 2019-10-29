use primitives::{Pair, Public};
use gather_runtime::{
	AccountId, AuraConfig, BalancesConfig, GenesisConfig, GrandpaConfig, GatherConfig,
	SudoConfig, IndicesConfig, SystemConfig, WASM_BINARY,
	gather::{
		Community, Group, GatheringInput, Membership, RSVP
	}
};
use aura_primitives::sr25519::{AuthorityId as AuraId};
use grandpa_primitives::{AuthorityId as GrandpaId};
use substrate_service;
use std::borrow::Cow;
use cid::Cid;


// Note this is the URL for the telemetry server
//const STAGING_TELEMETRY_URL: &str = "wss://telemetry.polkadot.io/submit/";

/// Specialized `ChainSpec`. This is a specialization of the general Substrate ChainSpec type.
pub type ChainSpec = substrate_service::ChainSpec<GenesisConfig>;

/// The chain specification option. This is expected to come in from the CLI and
/// is little more than one of a number of alternatives whicGatherConfigh can easily be converted
/// from a string (`--chain=...`) into a `ChainSpec`.
#[derive(Clone, Debug)]
pub enum Alternative {
	/// Whatever the current runtime is, with just Alice as an auth.
	Development,
	/// Whatever the current runtime is, with simple Alice/Bob auths.
	LocalTestnet,
	/// The current runtime with an extended auth mechanism for public demonstration
	/// still a single key authority, but not with Alice.
	DemoNet, 
}


/// Helper function to generate a crypto pair from seed
pub fn get_from_seed<TPublic: Public>(seed: &str) -> <TPublic::Pair as Pair>::Public {
	TPublic::Pair::from_string(&format!("//{}", seed), None)
		.expect("static values are valid; qed")
		.public()
}

/// Helper function to generate an authority key for Aura
pub fn get_authority_keys_from_seed(s: &str) -> (AuraId, GrandpaId) { 
	(
		get_from_seed::<AuraId>(s),
		get_from_seed::<GrandpaId>(s),
	)
}

impl Alternative {
	/// Get an actual chain config from one of the alternatives.
	pub(crate) fn load(self) -> Result<ChainSpec, String> {
		Ok(match self {
			Alternative::Development => ChainSpec::from_genesis(
				"Development",
				"dev",
				|| testnet_genesis(vec![
					get_authority_keys_from_seed("Alice"),
				],
				get_from_seed::<AccountId>("Alice"),
				vec![
					get_from_seed::<AccountId>("Alice"),
					get_from_seed::<AccountId>("Bob"),
					get_from_seed::<AccountId>("Alice//stash"),
					get_from_seed::<AccountId>("Bob//stash"),
				],
				true),
				vec![],
				None,
				None,
				None,
				None
			),
			Alternative::LocalTestnet => ChainSpec::from_genesis(
				"Local Testnet",
				"local_testnet",
				|| testnet_genesis(vec![
					get_authority_keys_from_seed("Alice"),
					get_authority_keys_from_seed("Bob"),
				], 
				get_from_seed::<AccountId>("Alice"),
				vec![
					get_from_seed::<AccountId>("Alice"),
					get_from_seed::<AccountId>("Bob"),
					get_from_seed::<AccountId>("Charlie"),
					get_from_seed::<AccountId>("Dave"),
					get_from_seed::<AccountId>("Eve"),
					get_from_seed::<AccountId>("Ferdie"),
					get_from_seed::<AccountId>("Alice//stash"),
					get_from_seed::<AccountId>("Bob//stash"),
					get_from_seed::<AccountId>("Charlie//stash"),
					get_from_seed::<AccountId>("Dave//stash"),
					get_from_seed::<AccountId>("Eve//stash"),
					get_from_seed::<AccountId>("Ferdie//stash"),
				],
				true),
				vec![],
				None,
				None,
				None,
				None
			),
			Alternative::DemoNet => {
				let spec = Cow::Owned(include_bytes!("../res/demo.json").to_vec());
				ChainSpec::from_json_bytes(spec).expect("handcrafted json spec parsing always works")
			},
		})
	}

	pub(crate) fn from(s: &str) -> Option<Self> {
		match s {
			"dev" => Some(Alternative::Development),
			"local" => Some(Alternative::LocalTestnet),
			"" | "demo" => Some(Alternative::DemoNet),
			_ => None,
		}
	}
}

fn testnet_genesis(initial_authorities: Vec<(AuraId, GrandpaId)>,
	root_key: AccountId, 
	endowed_accounts: Vec<AccountId>,
	_enable_println: bool
) -> GenesisConfig {

	let alice = get_from_seed::<AccountId>("gather@22:20");
	let bob = get_from_seed::<AccountId>("Alice");
	let soon = 1000;

	GenesisConfig {
		system: Some(SystemConfig {
			code: WASM_BINARY.to_vec(),
			changes_trie_config: Default::default(),
		}),
		indices: Some(IndicesConfig {
			ids: endowed_accounts.clone(),
		}),
		balances: Some(BalancesConfig {
			balances: endowed_accounts.iter().cloned().map(|k|(k, 1 << 60)).collect(),
			vesting: vec![],
		}),
		sudo: Some(SudoConfig {
			key: root_key,
		}),
		aura: Some(AuraConfig {
			authorities: initial_authorities.iter().map(|x| (x.0.clone())).collect(),
		}),
		grandpa: Some(GrandpaConfig {
			authorities: initial_authorities.iter().map(|x| (x.1.clone(), 1)).collect(),
		}),
		gather: Some(GatherConfig {
			communities_idx: vec![1u64, 2u64],
			communities: vec![
				(1u64, Community::default()),
				(2u64, Community::default()),
			],
			communities_members: vec![
				(1u64, vec![alice.clone(), bob.clone()]),
				(2u64, vec![alice.clone(), bob.clone()]),
			],
			members_communities: vec![
				(alice.clone(), vec![1u64, 2u64]),
				(bob.clone(), vec![1u64, 2u64]),
			],
			communities_groups: vec![
				(1, vec![3, 4]),
				(2, vec![5]),
			],
			groups_idx: vec![3u64, 4u64, 5u64],
			groups: vec![
				(3u64, Group::with_metadata(Cid::from("QmZG2mGFH7fuzhF3B6xnEv8wYZJ8Rirvmg3AyDRnHPoabu").unwrap().to_bytes())),
				(4u64, Group::with_metadata(Cid::from("QmfESjfnQx9Af2BidAuHsov4bEp5bAA87wzxJqmk7bnsYN").unwrap().to_bytes())),
				(5u64, Group::with_metadata(Cid::from("QmNthRBfkTH7tCuDcQDsvF6u9za2opxHv64rPSYxHvjNcr").unwrap().to_bytes())),
			],
			groups_members: vec![
				(3u64, vec![alice.clone(), bob.clone()]),
				(4u64, vec![alice.clone(), bob.clone()]),
				(5u64, vec![]),
			],
			members_groups: vec![
				(alice.clone(), vec![3u64, 4u64]),
				(bob.clone(), vec![3u64, 4u64]),
			],
			groups_gatherings: vec![
				(3u64, vec![6, 7]),
				(4u64, vec![]),
				(5u64, vec![8, 9]),
			],
			upcoming_gatherings_idx: vec![6u64, 7u64, 8u64, 9u64],
			archived_gatherings_idx: vec![6u64, 7u64, 8u64, 9u64],
			gatherings: vec![
				(6u64, GatheringInput::then(soon).as_new(3,0)),
				(7u64, GatheringInput::then(soon).as_new(3,0)),
				(8u64, GatheringInput::then(soon).as_new(5,0)),
				(9u64, GatheringInput::then(soon).as_new(5,0)),
			],
			gatherings_members: vec![
				(6u64, vec![alice.clone(), bob.clone()]),
				(7u64, vec![bob.clone()]),
				(8u64, vec![]),
				(9u64, vec![]),
			],
			members_gatherings: vec![
				(alice.clone(), vec![6u64]),
				(bob.clone(), vec![7u64, 8u64])
			],
			memberships: vec![
				// communities
				((alice.clone(), 1), Membership::default()),
				((alice.clone(), 2), Membership::default()),
				((bob.clone(), 1), Membership::default()),
				((bob.clone(), 2), Membership::default()),
				// groups
				((alice.clone(), 3), Membership::default()),
				((alice.clone(), 4), Membership::default()),
				((bob.clone(), 3), Membership::default()),
				((bob.clone(), 4), Membership::default()),
			],
			rsvps: vec![
				((alice.clone(), 6u64), RSVP::yes(None)),
				((bob.clone(), 6u64), RSVP::default()),
				((bob.clone(), 7u64), RSVP::default()),
			],
			nonce: 10u64,
		
		})
	}
}
