import { useState } from "react";

function ActionButton({ handleClick, text }) {
  const [isLoading, setIsLoading] = useState(false);
  async function handleButtonClick() {
    setIsLoading(true);

    try {
      await handleClick();
    } catch (error) {
      console.error("Error during button action:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <button className="button" disabled={isLoading} onClick={handleButtonClick}>
      {isLoading ? <span>Loading...</span> : text}
    </button>
  );
}

export default ActionButton;
