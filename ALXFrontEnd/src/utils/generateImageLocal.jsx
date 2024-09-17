import { Client } from "@gradio/client";

const generateImageLocal = async (prompt) => {
  const client = await Client.connect("prodia/sdxl-stable-diffusion-xl");
  const result = await client.predict("/flip_text", {
    prompt: prompt,
    negative_prompt:
      "3d, cartoon, anime, (deformed eyes, nose, ears, nose), bad anatomy, ugly",
    model: "dreamshaperXL10_alpha2.safetensors [c8afe2ef]",
    steps: 25,
    sampler: "DPM++ 3M SDE Exponential", // "DPM++ 2M Karras"
    cfg_scale: 7,
    resolution: "1344x768",
    seed: -1,
  });

  return result.data[0].url;
};

export default generateImageLocal;
