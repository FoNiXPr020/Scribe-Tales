import { Client } from "@gradio/client";

const generateImageLocal = async (prompt) => {
  const client = await Client.connect("https://0af354d941734f89a5.gradio.live/");
  const result = await client.predict(0, {
    prompt: "Generate an image based on my story: " + prompt,
    negative_prompt: "",
    prompt_expansion: ["A Magical Adventure Awaits", "magic", "colorful", "open atmosphere", "dramatic", "thought", "epic", "highly detailed", "artistic", "pure color", "light shining", "deep aesthetic", "magical", "mystical", "sharp focus", "inspired", "clear", "crisp", "extremely stylish", "creative", "cinematic", "positive", "unique", "amazing", "elegant", "fabulous", "very inspirational", "cute", "marvelous", "beautiful", "symmetry"],
    styles: '["Fooocus V2", "Fooocus Enhance", "Fooocus Sharp", "SAI Fantasy Art"]',
    performance: "Speed",
    steps: 25,
    resolution: ["1344", "768"],
    guidance_scale: 4.1,
    sharpness: 2,
    adm_guidance: ["1.5", "0.8", "0.3"],
    base_model: "juggernautXL_v8Rundiffusion.safetensors",
    refiner_model: "None",
    refiner_switch: 0.5,
    clip_skip: 2,
    sampler: "dpmpp_2m_sde_gpu",
    scheduler: "karras",
    vae: "Default (model)",
    seed: "-1",
    lora_combined_1: "sd_xl_offset_example-lora_1.0.safetensors : 0.1",
    metadata_scheme: false,
    version: "Fooocus v2.5.3"
  });

  console.log(result);
  return //result.data[0].url;
};

export default generateImageLocal;
