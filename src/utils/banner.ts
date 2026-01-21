import figlet from "figlet";

export const showBanner = async () => {
    const {atlas, pastel} = await import("gradient-string");

    const bannerText = "Personal Intelligence v1.0.0 "; // Your tool name
    
    // Generate ASCII art
    const ascii = figlet.textSync(bannerText, {
        font: "Standard", // Try 'Slant', 'Ghost', or 'Big'
        horizontalLayout: "default",
        verticalLayout: "default",
    });

    // Apply a beautiful gradient (e.g., 'atlas', 'cristal', or 'teen')
    console.log(atlas.multiline(ascii));
    console.log(pastel("--- Your personal intelligence assistance ---\n"));
};