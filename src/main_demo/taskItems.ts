export enum RequestUnitType {
    String = 'string',
    Integer = 'integer',
    Decimal = 'decimal',
    Video = 'video',
}

export interface RequestInputType {
    field_name: string;
    type: RequestUnitType;
    nullable: boolean;
}

export const taskItems = [
    {
	endpoint: "task/save_video",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: false },
	],
    },
    {
	endpoint: "task/get_video",
	request_fields: [],
    },
    {
	endpoint: "task/restore_video",
	request_fields: [],
    },
    {
	endpoint: "task/clear_last_video",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: false },
	],
    },
    {
	endpoint: "task/query_info",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: true },
	],
    },
    {
	endpoint: "task/select_frames",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: true },
	    { field_name: "frames", type: RequestUnitType.Integer, nullable: false },
	],
    },
    {
	endpoint: "task/select_at_fps",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: true },
	    { field_name: "fps", type: RequestUnitType.Integer, nullable: false },
	],
    },
    {
	endpoint: "task/draw_landmarks",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: true },
	],
    },
    {
	endpoint: "task/stsae_gcn_prediction",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: true },
	],
    },
    {
	endpoint: "task/downsample_it",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: true },
	    { field_name: "factor", type: RequestUnitType.Integer, nullable: false },
	],
    },
    {
	endpoint: "task/play_video",
	request_fields: [
	    { field_name: "video", type: RequestUnitType.Video, nullable: true },
	    { field_name: "fps", type: RequestUnitType.Integer, nullable: true },
	    { field_name: "frames", type: RequestUnitType.Integer, nullable: true },
	],
    },
];
