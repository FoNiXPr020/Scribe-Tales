import axios from "axios";

const grammarChecker = async (
  text,
  setErrors,
  setOutput,
  setLoading,
  setShowModal
) => {
  setErrors([]);
  setOutput("");
  setLoading(false);

  if (!text) {
    setErrors([
      {
        message: "Please enter a description",
      },
    ]);
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post("http://127.0.0.1:5000/check", {
      text: text,
    });

    const { corrected_text, errors } = response.data;
    //setErrors(errors);
    setOutput(corrected_text);
    setShowModal(true);
  } catch (error) {
    console.error("Error during grammar check:", error);
  }
  setLoading(false);
};

export default grammarChecker;
