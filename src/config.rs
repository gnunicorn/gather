use std::path::{Path, PathBuf};
use serde::{Serialize, Deserialize};
use toml;
use std::fs;
use gather_emailer::EmailConfig;

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
        // make sure the folder exists
        if let Some(dir) = config_file_path.parent() {
            if !dir.is_dir() {
                std::fs::create_dir_all(dir).map_err(|e| format!("could not create config dir: {}", e))?
            }
        }
        // we write the defaults to the config
        fs::write(config_file_path, toml::to_string(
                &GatherConfig::default()).expect("Handcrafted to never fail"))
        .expect("Writing the gather.toml failed");
    }

    let content = fs::read(config_file_path).map_err(|e| format!("failed to open gather.toml: {}", e))?;
    toml::from_slice::<GatherConfig>(&content)
        .map_err(|e| format!("Error parsing configuration gather.toml: {}", e))
}