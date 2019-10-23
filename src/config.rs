use std::path::{Path, PathBuf};
use serde::{Serialize, Deserialize};
use toml;
use std::fs;
use lettre::smtp::{ConnectionReuseParameters, authentication::Mechanism};


/// The different Email Transports supported
#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "transport")]
pub enum EmailConfig {
    /// Stub transport, default - see https://lettre.at/sending-messages/stub.html
    #[serde(alias="stub")]
    Stub,
    /// Send via local sendmail - see https://lettre.at/sending-messages/sendmail.html
    #[serde(alias="sendmail")]
    Sendmail,
    /// File based "sending" - see https://lettre.at/sending-messages/file.html
    #[serde(alias="file")]
    File {
        #[serde(default = "std::env::temp_dir" )]
        file: PathBuf
    },
    /// SMTP configuration - see https://lettre.at/sending-messages/smtp.html
    #[serde(alias="smtp")]
    SMTP {
        host: Option<String>,
        username: Option<String>,
        password: Option<String>,
        auth: Option<Mechanism>,
        connection_reuse: Option<ConnectionReuseParameters>,
        smtp_utf8: bool,
    },
}

impl std::default::Default for EmailConfig {
    fn default() -> EmailConfig {
        EmailConfig::Stub
    }
}

/// Our Gather configuration file
#[derive(Serialize, Deserialize, Debug)]
pub struct GatherConfig {
    pub email: EmailConfig
}

impl std::default::Default for GatherConfig {
    fn default() -> GatherConfig {
        GatherConfig {
            email: Default::default()
        }
    }
}

pub fn load_config(config_file_path: &Path) -> Result<GatherConfig, String> {
    if !config_file_path.is_file() {
        // we write the defaults to the config
        fs::write(config_file_path, toml::to_string(
                &GatherConfig::default()).expect("Handcrafted to never fail"))
        .expect("Writing the gather.toml failed");
    }

    let content = fs::read(config_file_path).map_err(|e| format!("failed to open gather.toml: {}", e))?;
    toml::from_slice::<GatherConfig>(&content)
        .map_err(|e| format!("Error parsing configuration gather.toml: {}", e))
}