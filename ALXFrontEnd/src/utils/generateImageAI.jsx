import { Client } from "@gradio/client";

const generateImageAI = async (prompt) => {
  const client = await Client.connect("mukaist/Midjourney");
  const result = await client.predict("/run", {
    prompt: "Generate an image based on my story: " + prompt,
    negative_prompt: "Avoid any modern or futuristic elements, bright neon colors, or overtly urban details. The scene should not include contemporary technology or urban clutter, an image that maintains full privacy and respect by ensuring that any potentially explicit or sensitive areas are blurred or obscured. The image should focus on general aesthetics without including or highlighting any nudity or explicit content",
    use_negative_prompt: true,
    style: "2560 x 1440",
    seed: 0,
    width: 512,
    height: 512,
    guidance_scale: 0.1,
    randomize_seed: true,
  });

  return result.data[0][0].image.url;
};

export default generateImageAI;