
use jsonrpc_derive::rpc;
use jsonrpc_core::Result;
use jsonrpc_core::types::error::Error as ApiError;
use codec::{Codec, Encode, Decode};
use substrate_client::backend::OffchainStorage;
use substrate_offchain::STORAGE_PREFIX as OC_STORAGE_PREFIX;
use gather_emailer::{EmailSender, Email, TEMPLATE_RENDERER};
use parking_lot::Mutex;
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;
use std::collections::BTreeMap;


const LOCAL_STORAGE_PREFIX: &'static [u8; 6] = b"gather";

/// Substrate system RPC API
#[rpc]
pub trait GatherApi<AccountId> {
	/// Register (or overwrite) the target of notifications for `account`
    /// to `email`
	#[rpc(name = "gather_registerNotify")]
	fn register_notify(&self, account: AccountId, email: String) -> Result<()>;

	#[rpc(name = "gather_confirmEmailToken")]
	fn confirm_token(&self, token: String) -> Result<()>;
}

#[derive(Encode, Decode)]
struct EmailToken<A> {
	account: A,
	email: String,
}

/// An implementation of System-specific RPC methods.
pub struct Gather<B> {
	backend: B,
    emailer: Mutex<EmailSender>
}

impl<B> Gather<B> {
	/// Create new `Gather` interface given backend.
	pub fn new(backend: B, emailer: EmailSender) -> Self {
		Gather {
			backend,
            emailer: Mutex::new(emailer)
		}
	}
}

impl<B, AccountId> GatherApi<AccountId> for Gather<B>
where
	B: OffchainStorage + 'static,
	AccountId: Clone + std::fmt::Display + Codec,
{
    fn register_notify(&self, account: AccountId, email: String) -> Result<()> {
        println!("confirming {} for {}", email, account);
		let token: String = thread_rng()
			.sample_iter(&Alphanumeric)
			.take(8)
			.collect();

		let key = format!("token_{}", &token);
		let value = EmailToken { account: account.clone(), email: email.clone() };

        // FIXME, make sure this flow actually works.
        self.backend.clone().set(LOCAL_STORAGE_PREFIX, key.as_bytes(), &value.encode());

		let tmpl = "confirm-email";
		let mut data = BTreeMap::new();
		data.insert("token".to_string(), token);
		data.insert("account".to_string(), format!("{}", account));

		let subject = TEMPLATE_RENDERER.render(&format!("emails/subject/{}", tmpl), &data)
					.map_err(|e| {
						println!("rendering subject failed: {}", e);
						ApiError::invalid_params("subject rendering failed")
					})?;
		let html = TEMPLATE_RENDERER.render(&format!("emails/html/{}", tmpl), &data)
						.map_err(|e| {
							println!("rendering email body failed: {}", e);
							ApiError::invalid_params("body rendering failed")
						})?;
		let builder = Email::builder()
			.to(email)
			.subject(subject)
			.html(html);
		self.emailer.lock().send(builder).map_err(|e| {
			println!("Sending email failed: {}", e);
			ApiError::invalid_params("sending email failed")
		})?;
        Ok(())
    }

	fn confirm_token(&self, token: String) -> Result<()> {
		let mut backend = self.backend.clone();
		let key = format!("token_{}", token);
		let value = backend.get(LOCAL_STORAGE_PREFIX, key.as_bytes()).ok_or_else(|| ApiError::invalid_params("Token not valid"))?;
        let email_token = EmailToken::<AccountId>::decode(&mut value.as_slice()).map_err(|e| {
			let msg = format!("Could not decode EmailToken: {}", e);
			println!("{}", msg);
			ApiError::invalid_params(msg)
		})?;
		let target_key = format!("email_{}", email_token.account);

        backend.set(OC_STORAGE_PREFIX, target_key.as_bytes(), email_token.email.as_bytes());
        // FIXME: add when supported - backend.remove(LOCAL_STORAGE_PREFIX, key)?;
		backend.set(LOCAL_STORAGE_PREFIX, key.as_bytes(), "".as_bytes());
		Ok(())
	}
}