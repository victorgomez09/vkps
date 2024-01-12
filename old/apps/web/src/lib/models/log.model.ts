export interface LogLines {
	id: string;
	time: number;
	app: string;
	pod: string;
	podID: string;
	container: string;
	color: string;
	log: string;
}
