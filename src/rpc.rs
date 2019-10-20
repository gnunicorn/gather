
use jsonrpc_derive::rpc;
use jsonrpc_core::Result;
use codec::Codec;
use std::sync::Arc;

/// Substrate system RPC API
#[rpc]
pub trait GatherApi<AccountId> {
	/// Register (or overwrite) the target of notifications for `account`
    /// to `email`
	#[rpc(name = "register_notify")]
	fn register_notify(&self, account: AccountId, email: String) -> Result<String>;
}


/// An implementation of System-specific RPC methods.
pub struct Gather<C> {
	client: Arc<C>,
}

impl<C> Gather< C> {
	/// Create new `System` given client and transaction pool.
	pub fn new(client: Arc<C>) -> Self {
		Gather {
			client,
		}
	}
}

impl<C, AccountId> GatherApi<AccountId> for Gather<C>
where
	C: Send + Sync + 'static,
	AccountId: Clone + std::fmt::Display + Codec,
{
    fn register_notify(&self, _account: AccountId, email: String) -> Result<String> {
        println!("Pinged with: {}", email);
        Ok(email)
    }
}