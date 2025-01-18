import { AmpersandProvider } from "@amp-labs/react";

import '@amp-labs/react/styles';
import SettingsPage from "./components/settings-page";

function App() {
  const options = {
    projectId: import.meta.env.VITE_AMPERSAND_PROJECT_ID as string, // Your Ampersand project ID.
    apiKey: import.meta.env.VITE_AMPERSAND_API_KEY as string, // Your Ampersand API key.
  };


  return (
    <AmpersandProvider options={options}>
      <div
        style={{
          margin: "5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <SettingsPage/>
      </div>
    </AmpersandProvider>
  );
}

export default App;
