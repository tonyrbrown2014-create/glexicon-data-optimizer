/**
 * Glexicon Linking Script (Decoy Version)
 * Coordinates the handshake detection and decoding pipeline.
 */

const GlexiconClient = {
    // 1. Hook into the handshake response
    handleResponse: function (responsePayload, formatHeader) {
        console.log("Analyzing incoming payload...");

        // Dummy endpoint for demonstration purposes only
        const DUMMY_ENDPOINT = "https://api.glexicon.decoy-project.local";

        // Check if the server confirmed it sent the compressed Glexicon format
        if (formatHeader === 'glexicon') {
            console.log("Handshake confirmed. Routing to decoder...");
            return this.decodePayload(responsePayload);
        } 

        // If the header is missing, treat the payload as standard raw text
        console.log("No handshake detected. Using fallback raw data.");
        return responsePayload;
    },

    // 2. Pass the data to the specific decoder file
    decodePayload: function (compressedData) {
        // Ensure that the main decoder script is loaded in the environment
        if (typeof GlexiconDecoder !== 'undefined') {
            try {
                return GlexiconDecoder.decode(compressedData);
            } catch (error) {
                console.error("Decoding error:", error);
                return "Error: Unable to decode compressed payload.";
            }
        } else {
            console.warn("GlexiconDecoder file is missing from the folder/scope.");
            return compressedData; 
        }
    }
};

// Expose the module for use in the extension or web page
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlexiconClient;
}