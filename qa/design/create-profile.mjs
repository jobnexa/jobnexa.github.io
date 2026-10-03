import { readFile, writeFile } from 'node:fs/promises';

const measured = JSON.parse(await readFile(new URL('./reference-colors.json', import.meta.url), 'utf8'));
const exact = JSON.parse(await readFile(new URL('./reference-exact-colors.json', import.meta.url), 'utf8'));
const type = (size, weight = 400, line_height = 1.5) => ({ size, weight, line_height, tracking: '0' });
const none = (params) => ({ enabled: false, type: 'none', description: 'Not visible in the reference; omitted from implementation.', technology: 'none', params });
const dna = {
  meta: { name: 'SkillMatch reference', description: 'Compact job dashboard based on the user screenshot, with added skills onboarding and honest external applications.', source_references: ['User attachment: codex-clipboard-dba83730-32bb-43a9-ae72-3c4854f85e43.png'], created_at: '2026-10-03' },
  design_system: {
    color: {
      palette_type: 'analogous', primary: { hex: '#3444da', role: 'Primary action' }, secondary: { hex: '#e1e3f9', role: 'Card outlines' }, accent: { hex: '#4166cf', role: 'Clustered measured blue accent' },
      neutral: { scale: ['#ffffff', '#f9f9fd', '#f5f4f8', '#d9d9e7', '#79708f', '#42456e', '#2a2b2f'], usage: 'Exact dominant RGB frequencies distinguish white cards, page background, and lavender borders. Dark end used for foreground.' },
      semantic: { success: '#16813d', warning: '#805815', error: '#a52842', info: '#3444da' },
      surface: { background: '#f9f9fd', card: '#ffffff', elevated: '#eff1ff' },
      contrast_strategy: 'Dark-on-light text; blue actions; distinguish surfaces with borders. Actual page background uses exact RGB #f5f4f8 rather than the merged clustering average.',
      measurement: measured.measurement, measured_palette: measured.palette,
      exact_pixel_palette: exact.palette,
    },
    typography: {
      type_scale: { display: type('30px', 600, 1.2), heading_1: type('26px', 600, 1.25), heading_2: type('20px', 600, 1.3), heading_3: type('15px', 600, 1.35), body: type('14px'), body_small: type('12px'), caption: type('11px'), overline: type('11px', 500) },
      font_families: { heading: 'Inter, Segoe UI, sans-serif', body: 'Inter, Segoe UI, sans-serif', mono: 'Consolas, monospace' },
      font_style_notes: 'Screenshot resembles a geometric sans; use installed system sans without remote font requests. Sizes are visually inferred, not font identification.',
    },
    spacing: { base_unit: '4px', scale: ['4px', '8px', '12px', '16px', '20px', '24px', '32px'], content_density: 'compact', section_rhythm: '20px gaps between card rows; short metadata spacing' },
    layout: { grid_system: 'Equal-width responsive CSS grid', max_content_width: '1680px', columns: { desktop: 3, tablet: 2, mobile: 1 }, gutter: '20px', breakpoints: { tablet: '680px', desktop: '1100px' }, alignment_tendency: 'strict grid; left-aligned metadata' },
    shape: { border_radius: { small: '4px', medium: '8px', large: '12px', pill: '999px only for compact count badges' }, border_usage: '3px pale lavender card outlines; 1px neutral skill chips', divider_style: 'White separating line above Apply footer' },
    elevation: { shadow_style: 'none', levels: { low: 'none', medium: 'none', high: 'none' }, depth_cues: 'Surface color and border intensity' },
    iconography: { style: 'Simple line icons only where meaningful', stroke_weight: '1.5px', size_scale: ['14px', '18px', '24px'], preferred_set: 'Inline SVG and text, no additional icon library' },
    motion: { easing: 'ease-out', duration_scale: { micro: '120ms', normal: '180ms', macro: 'none' }, entrance_pattern: 'none', exit_pattern: 'none', philosophy: 'Minimal functional; respect reduced motion' },
    components: { button_style: 'Full-width pale lavender Apply footer with blue text; solid blue primary onboarding action', input_style: 'White fields with subtle outline and visible focus', card_style: 'Dense white panel: date, title, openings if provided, outlined skill chips, salary, Apply footer', navigation_pattern: 'Compact horizontal tab bar with tinted active tab', modal_style: 'Inline skills chooser panel to avoid blocking browsing', list_style: 'Three-column desktop job cards', component_notes: 'Title opens detail; Apply opens source URL. No fabricated Applied or Invites states.' },
  },
  design_style: {
    aesthetic: { mood: ['calm', 'clear', 'professional'], visual_metaphor: 'A quiet application dashboard', era_influence: 'Contemporary web application', genre: 'Job board SaaS', personality_traits: ['precise', 'approachable', 'practical'], adjectives: ['compact', 'light', 'orderly'] },
    visual_language: { complexity: 'minimal', ornamentation: 'none', whitespace_usage: 'Compact within cards; consistent gutters', visual_weight_distribution: 'Distributed across equal cards', focal_strategy: 'Job titles and Apply strips', contrast_level: 'Dark readable text; subtle surfaces', texture_usage: 'none' },
    composition: { hierarchy_method: 'Typography and grouping', balance_type: 'symmetric grid', flow_direction: 'Top to bottom; left to right', grouping_strategy: 'Bordered cards and outlined skill chips', negative_space_role: 'Separation between listings' },
    imagery: { photo_treatment: 'No photography', illustration_style: 'none', graphic_elements: 'Borders and simple check marks', pattern_usage: 'none', image_shape: 'none' },
    interaction_feel: { feedback_style: 'Active tab, checkbox states, counts and matching indicators', hover_behavior: 'Subtle tint and clear link emphasis', transition_personality: 'snappy', loading_style: 'Static HTML with immediate browser enhancement', microinteraction_density: 'low' },
    brand_voice_in_ui: { tone: 'clear and helpful', formality: 'neutral', cta_style: 'Direct imperative in English', empty_state_approach: 'Explain missing jobs or skills and offer a relevant next action', error_tone: 'Specific, calm, actionable' },
  },
  visual_effects: {
    overview: { effect_intensity: 'none', performance_tier: 'lightweight', fallback_strategy: 'Static jobs remain available without JavaScript', primary_technology: 'CSS only with vanilla browser interactions' },
    background_effects: { type: 'none', description: 'Flat pale background', technology: 'CSS', params: { color_palette: ['#f5f4f8'], speed: 0, density: 0, opacity: 1, blend_mode: 'normal' } },
    particle_systems: none({ count: 0, shape: 'none', size_range: [0, 0], movement_pattern: 'none', color_behavior: 'none', interaction: 'none', spawn_area: 'none' }),
    '3d_elements': none({ renderer: 'none', lighting: 'none', camera: 'none', materials: 'none', geometry: 'none', post_processing: ['none'], interaction_model: 'none' }),
    shader_effects: none({ uniforms: ['none'], vertex_manipulation: 'none', fragment_output: 'none', noise_type: 'none', distortion: 0 }),
    scroll_effects: { parallax: { enabled: false, layers: 0, depth_range: [0, 0], speed_curve: 'none' }, scroll_triggered_animations: { enabled: false, trigger_points: ['none'], animation_type: 'none', scrub_behavior: 'none' }, scroll_morphing: { enabled: false, description: 'none' } },
    text_effects: { type: 'none', description: 'Plain readable text', technology: 'HTML/CSS', params: { split_strategy: 'none', animation_per_unit: 'none', stagger: 0, effect_style: 'none' } },
    cursor_effects: { enabled: false, type: 'none', description: 'Native pointer', params: { shape: 'native', size: 'native', blend_mode: 'normal', trail: 'none', interaction_zone: 'none' } },
    image_effects: { type: 'none', description: 'No image effects', technology: 'none', params: { filter_pipeline: ['none'], hover_transform: 'none', reveal_animation: 'none', distortion_type: 'none' } },
    glassmorphism_neumorphism: { enabled: false, style: 'none', params: { blur_radius: 0, transparency: 0, border_treatment: 'Plain outlined surfaces', shadow_type: 'none', light_source_angle: 0 } },
    canvas_drawings: none({ draw_method: 'none', animation_loop: 'none', color_scheme: 'none', responsiveness: 'none', interaction: 'none' }),
    svg_animations: { enabled: false, type: 'none', description: 'Static icons only', params: { animation_method: 'none', path_morphing: 'none', stroke_animation: 'none', filter_effects: 'none' } },
    composite_notes: 'Only static screenshot observations; no motion inferred. Added skills flow follows the user request. Colors measured by deterministic clustering plus exact RGB frequency, layout dimensions inferred visually.',
  },
};
await writeFile(new URL('./reference-dna.json', import.meta.url), JSON.stringify(dna, null, 2));
