# Hero Section Photo & Orbit Animation Plan (Lando Norris Style)
## Youssef Eslam Hussein — Portfolio Website

This document details the plan to upgrade the Hero section's central visual component. We are moving from the abstract geometric wireframe avatar to a high-quality cutout portrait photo of Youssef, surrounded by interactive 3D orbiting objects, inspired by [landonorris.com](https://landonorris.com/).

---

## 🎯 Goal
Create a premium, professional, and interactive first impression that features Youssef's actual face (cutout portrait) in the center of the screen, with 3D elements (orbiting rings, floating diamonds, and particles) moving around him in real-time. 

---

## 📷 What You (Youssef) Need to Prepare

To make this look stunning, please prepare and place your photo in the project:
1. **File Path:** `public/images/youssef-hero.png`
2. **File Format:** **PNG** (with a fully transparent background).
3. **Photo Style:** A high-resolution portrait or half-body shot looking forward or slightly angled. Ensure it is cropped clean.
4. **Initial Placeholder:** We will place a temporary high-quality silhouette/placeholder in `public/images/youssef-hero.png` so the code works immediately. You can overwrite this file anytime.

---

## 🛠️ Technical Design & How it Works

### 1. The 3D Photo Plane (Three.js)
Instead of rendering the wireframe chest/head meshes in `src/lib/three-avatar.js`, we will load `youssef-hero.png` as a `THREE.Texture` using `THREE.TextureLoader`.
* We will create a `THREE.PlaneGeometry` mesh at the center of the coordinates `(0, 0, 0)`.
* We will apply a `THREE.MeshBasicMaterial` (or `THREE.MeshStandardMaterial` to respond to our point lights) with `transparent: true` and `alphaTest: 0.15` (to prevent square background clipping).
* Once the image loads, we will dynamically scale the plane's aspect ratio so the photo does not stretch or warp:
  ```javascript
  const aspect = texture.image.width / texture.image.height;
  plane.scale.set(aspect * 3.8, 3.8, 1);
  ```

### 2. Orbiting in 3D Space
Because the photo plane is a real object positioned at `Z = 0`:
* Orbiting elements (the Torus rings and Octahedron diamonds) will naturally pass **in front of** the photo when their Z-coordinate is positive (`Z > 0`).
* They will pass **behind** the photo when their Z-coordinate is negative (`Z < 0`).
* The particle cloud will float around the photo in all directions, providing a sense of depth and atmospheric immersion.

### 3. Mouse Parallax and Floating Animations
* **Float:** A subtle sine-wave translation on the Y-axis will make your portrait gently float up and down over time.
* **Tilt:** The photo plane will tilt subtly based on your mouse cursor's X and Y coordinates (e.g. rotating slightly on the X and Y axes) to create a beautiful 3D tilt effect.
* **Depth Parallax:** The orbiting rings and background lights will respond to the mouse cursor at a slightly different speed than the photo plane, creating a strong sense of foreground/background depth.

---

## 📂 Proposed File Changes

| File | Action | Purpose |
|---|---|---|
| `public/images/youssef-hero.png` | **NEW [Placeholder]** | Cutout portrait placeholder image |
| `src/lib/three-avatar.js` | **MODIFY** | Load portrait texture, replace 3D wireframe mesh, scale aspect ratio, implement 3D tilts |
| `plans/face_animation.md` | **NEW** | This plan file tracking the feature goals and status |

---

## 🏁 Verification Checklist

- [ ] Placeholder portrait image saved in `/public/images/youssef-hero.png`
- [ ] `three-avatar.js` updated to load texture and render plane
- [ ] Verify photo maintains original aspect ratio (not stretched)
- [ ] Verify rings and diamonds orbit in front and behind the photo correctly
- [ ] Verify mouse movements trigger smooth 3D tilt and parallax
- [ ] Verify mobile layout scales and centers the photo and particles correctly
- [ ] Overwrite with Youssef's actual PNG photo and verify it displays perfectly

---
*Plan created: June 24, 2026 | Part of the Youssef Eslam Portfolio Plans*
