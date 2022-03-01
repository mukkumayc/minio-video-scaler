import { spawn } from "child_process";
import path from "path";

const scales = {
	240: [426, 240],
	360: [640, 360],
	480: [854, 480],
	720: [1280, 720],
	1080: [1920, 1080],
};

/**
 * Return function that scales video to some resolution and save it with name [videoname]-[resolution].mp4 in the same dir
 * @param videoPath path to the source video
 * @param resolution resolution of resulting video (360p, 480p, etc.)
 * @returns path to resulting video
 */
const videoScaler =
	(videoPath: string) => (resolution: 240 | 360 | 480 | 720 | 1080) => {
		const filename = path.basename(videoPath);
		const dir = path.dirname(videoPath);
		const s = scales[resolution];
		const newFilename = `${dir}/${filename.slice(
			0,
			filename.lastIndexOf(".")
		)}-${resolution}.mp4`;

		console.log("Scaling video", filename, "to", resolution);

		const process = spawn("ffmpeg", [
			"-y",
			"-i",
			videoPath,
			"-vf",
			`scale=${s[0]}:${s[1]}`,
			newFilename,
		]);

		return new Promise<string>((resolve, reject) => {
			process.on("close", (code) => {
				console.log(`Scaling to ${resolution} completed`);
				return code
					? reject(Error(`Process ended with code '${code}'`))
					: resolve(newFilename);
			});
		});
	};

export default videoScaler;
