fn main() {
    #[cfg(target_os = "macos")]
    {
        println!("cargo:rustc-link-lib=framework=Speech");
        // Rust's nodefaultlibs omits the availability runtime used by Metal.
        let output = std::process::Command::new("xcrun")
            .args(["clang", "-print-file-name=libclang_rt.osx.a"])
            .output()
            .expect("Find the Apple clang runtime");
        assert!(output.status.success(), "Apple clang is required");
        let runtime = String::from_utf8(output.stdout).expect("Clang runtime path");
        let runtime = std::path::Path::new(runtime.trim());
        assert!(runtime.is_file(), "Apple clang runtime is missing");
        println!(
            "cargo:rustc-link-search=native={}",
            runtime.parent().unwrap().display()
        );
        println!("cargo:rustc-link-lib=static=clang_rt.osx");
    }

    #[cfg(target_os = "windows")]
    println!(
        "cargo:rustc-link-arg=/MANIFESTDEPENDENCY:type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='*' publicKeyToken='6595b64144ccf1df' language='*'"
    );

    tauri_build::build()
}
