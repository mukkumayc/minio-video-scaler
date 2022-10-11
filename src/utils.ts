import path from 'path'

export const cutParentDir = (filepath: string) =>
	path.join(...filepath.split(path.sep).slice(1))
