import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { OgConfig } from '$lib/types';

const WIDTH = 1200;
const HEIGHT = 630;

interface OgFont {
	data: ArrayBuffer;
	weight: 400 | 600 | 700;
}

interface RenderInput {
	title: string;
	description?: string;
	siteName: string;
	og?: OgConfig;
	fonts: OgFont[];
	logo?: string;
}

function clamp(value: string, max: number): string {
	const trimmed = value.trim();
	return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

export async function renderOgImage({
	title,
	description,
	siteName,
	og,
	fonts,
	logo
}: RenderInput): Promise<Uint8Array> {
	const background = og?.background ?? '#0a0a0a';
	const foreground = og?.foreground ?? '#fafafa';
	const muted = og?.muted ?? '#a1a1a1';
	const accent = og?.accent ?? foreground;

	const headline = clamp(title, 80);
	const subtitle = description ? clamp(description, 140) : '';

	const element = {
		type: 'div',
		props: {
			style: {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '80px',
				backgroundColor: background,
				color: foreground,
				fontFamily: 'Geist'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: '14px',
							fontSize: '30px',
							fontWeight: 600,
							color: accent
						},
						children: [
							logo
								? {
										type: 'img',
										props: { src: logo, width: 30, height: 32 }
									}
								: {
										type: 'div',
										props: {
											style: {
												width: '20px',
												height: '20px',
												borderRadius: '6px',
												backgroundColor: accent
											},
											children: ''
										}
									},
							siteName
						]
					}
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column' },
						children: [
							{
								type: 'div',
								props: {
									style: { display: 'flex', fontSize: '68px', fontWeight: 700, lineHeight: 1.1 },
									children: headline
								}
							},
							subtitle
								? {
										type: 'div',
										props: {
											style: {
												display: 'flex',
												marginTop: '24px',
												fontSize: '32px',
												lineHeight: 1.3,
												color: muted
											},
											children: subtitle
										}
									}
								: null
						]
					}
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', fontSize: '26px', color: muted },
						children: siteName.toLowerCase()
					}
				}
			]
		}
	};

	const svg = await satori(element, {
		width: WIDTH,
		height: HEIGHT,
		fonts: fonts.map((f) => ({ name: 'Geist', data: f.data, weight: f.weight, style: 'normal' }))
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
	return resvg.render().asPng();
}
