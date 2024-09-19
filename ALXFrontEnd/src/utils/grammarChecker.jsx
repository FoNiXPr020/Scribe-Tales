import axios from "axios";
import { toast } from "react-toastify";

const grammarChecker = async (text, setOutput, setLoading, setShowModal) => {
  setOutput("");
  setLoading(false);

  if (!text) {
    toast.error(
      "Please enter a description, it should be longer than 100 characters."
    );
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post("http://127.0.0.1:5000/check", {
      text: text,
    });

    const { corrected_text, errors } = response.data;
    setOutput(corrected_text);
    setShowModal(true);
  } catch (error) {
    toast.error("Error during grammar checking " + error.message);
    console.error("Error during grammar check:", error);
  } finally {
    setLoading(false);
  }
};

export default grammarChecker;
