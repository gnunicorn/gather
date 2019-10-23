
use jsonrpc_derive::rpc;
use jsonrpc_core::Result;
use codec::Codec;
use substrate_client::backend::OffchainStorage;
use substrate_offchain::STORAGE_PREFIX;
use crate::email::EmailSender;

/// Substrate system RPC API
#[rpc]
pub trait GatherApi<AccountId> {
	/// Register (or overwrite) the target of notifications for `account`
    /// to `email`
	#[rpc(name = "system_registerNotify")]
	fn register_notify(&self, account: AccountId, email: String) -> Result<String>;
}


/// An implementation of System-specific RPC methods.
pub struct Gather<B> {
	backend: B,
    emailer: EmailSender
}

impl<B> Gather<B> {
	/// Create new `Gather` interface given backend.
	pub fn new(backend: B, emailer: EmailSender) -> Self {
		Gather {
			backend,
            emailer
		}
	}
}

impl<B, AccountId> GatherApi<AccountId> for Gather<B>
where
	B: OffchainStorage + 'static,
	AccountId: Clone + std::fmt::Display + Codec,
{
    fn register_notify(&self, account: AccountId, email: String) -> Result<String> {
        println!("storing {} for {}", email, account);
        // FIXME: this should do an actual auth flow.
        self.backend.clone().set(STORAGE_PREFIX, &account.encode(), email.as_bytes());
        Ok(email)
    }
}