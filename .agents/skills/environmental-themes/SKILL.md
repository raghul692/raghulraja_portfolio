---
name: environmental-themes
description: >
  Architects, configures, and verifies a 5-mode environmental theme system
  (Sun, Dark, Moon, Rain, Snow) with zero-overhead HTML5 Canvas particle engines,
  seamless Framer Motion icon morphing, and backward-compatible CSS variables.
---

# 5-Mode Environmental Theme System

Architectural pattern and reference guide for implementing multi-environmental theme switching with zero CPU/GPU overhead on static sites and single-page applications.

## Theme Modes Sequence

$$\text{SUN} \longrightarrow \text{DARK} \longrightarrow \text{MOON} \longrightarrow \text{RAIN} \longrightarrow \text{SNOW} \longrightarrow \text{SUN}$$

1. **SUN**: Bright, minimal Apple-like off-white (`#fafafa`), dark charcoal typography (`#18181b`), subtle glass borders. Particle engine stopped.
2. **DARK**: Signature baseline obsidian dark theme (`#06060a`), high-contrast neon accents. Particle engine stopped.
3. **MOON**: Futuristic midnight navy atmosphere (`#020617` → `#080e22`) with slowly descending falling micro-stars and subtle horizontal sine-wave drift.
4. **RAIN**: Realistic atmospheric rainfall with dual-depth streaks (speed 18–34px/frame, diagonal slant) and atmospheric mist gradient.
5. **SNOW**: Soft winter frost atmosphere (`#f1f5f9` → `#e2e8f0`) with gentle drifting snowflakes oscillating with natural sway.

---

## Core Technical Rules

1. **Single Theme Control**: Only display ONE button in the navigation bar showing the active mode's icon.
2. **Zero Overhead Lifecycle**:
   * Cancel `requestAnimationFrame` loop immediately when entering `sun` or `dark` modes.
   * Clear particle arrays upon switching environments to eliminate memory leaks.
3. **Responsive Density**:
   * Mobile viewports (`< 768px`) reduce particle count by 50% to conserve battery.
   * Respect `prefers-reduced-motion` media queries by freezing particle velocities.
4. **Layering & Readability**:
   * Canvas backdrop: `fixed inset-0 pointer-events-none z-0`.
   * Portfolio content: `relative z-10`.
   * Header/Navbar: `z-50`.
5. **Client Persistence**:
   * Persist active mode in `localStorage.getItem('portfolio_env_theme_v1')`.
   * On initial visit, default to `dark`.

---

## Verification & Health Check Commands

```bash
# Verify TypeScript compilation and production bundle
npm run build

# Check active theme class applied to html
python -c "
with open('dist/index.html', 'r') as f:
    print('dist includes environmental theme assets')
"
```
