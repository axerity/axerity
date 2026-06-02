import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { OgConfig } from '$lib/types';

const WIDTH = 1200;
const HEIGHT = 630;

interface OgFont {
	data: ArrayBuffer;
	weight: 400 | 600 | 700;
}

interface OgLogo {
	src: string;
	width: number;
	height: number;
}

interface RenderInput {
	title: string;
	description?: string;
	siteName: string;
	eyebrow?: string;
	og?: OgConfig;
	fonts: OgFont[];
	logo?: OgLogo;
}

function clamp(value: string, max: number): string {
	const trimmed = value.trim();
	return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

function withAlpha(hex: string, alpha: number): string {
	const m = hex.replace('#', '');
	const r = parseInt(m.slice(0, 2), 16);
	const g = parseInt(m.slice(2, 4), 16);
	const b = parseInt(m.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function renderOgImage({
	title,
	description,
	siteName,
	eyebrow,
	og,
	fonts,
	logo
}: RenderInput): Promise<Uint8Array> {
	const background = og?.background ?? '#0a0a0a';
	const foreground = og?.foreground ?? '#fafafa';
	const muted = og?.muted ?? '#a1a1a1';
	const accent = og?.accent ?? foreground;
	const glow = withAlpha(accent, 0.2);

	const headline = clamp(title, 80);
	const subtitle = description ? clamp(description, 140) : '';

	const top = logo
		? { type: 'img', props: { src: logo.src, width: logo.width, height: logo.height } }
		: {
				type: 'div',
				props: {
					style: { display: 'flex', fontSize: '34px', fontWeight: 600, color: accent },
					children: siteName
				}
			};

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
				backgroundImage: `radial-gradient(95% 125% at 95% 100%, ${glow} 0%, ${background} 65%)`,
				color: foreground,
				fontFamily: 'Geist'
			},
			children: [
				top,
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column' },
						children: [
							eyebrow
								? {
										type: 'div',
										props: {
											style: {
												display: 'flex',
												fontSize: '30px',
												fontWeight: 600,
												color: accent,
												marginBottom: '18px'
											},
											children: eyebrow
										}
									}
								: null,
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: '72px',
										fontWeight: 700,
										lineHeight: 1.05,
										letterSpacing: '-0.02em'
									},
									children: headline
								}
							},
							subtitle
								? {
										type: 'div',
										props: {
											style: {
												display: 'flex',
												marginTop: '28px',
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
