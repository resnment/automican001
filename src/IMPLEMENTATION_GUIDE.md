# AI Agent Portrait Implementation Guide

## What's Changed

**New Features:**
- Half-body humanoid AI agent (head, torso, arms, hands)
- 6 floating holographic UI panels orbiting the agent
- Particle streams flowing from agent's hands to UI panels
- Animated work behaviors (head movements, arm gestures, breathing)
- Each UI panel has icons, progress bars, and task indicators
- Maintains 60fps performance

**Visual Elements:**
- Geometric low-poly design (boxes, cylinders, spheres)
- Teal (#00f2ff) and violet (#8b5cf6) color scheme
- Translucent materials with glow effects
- Wireframe overlays for sci-fi aesthetic
- Glowing eyes and chest core

## Implementation Steps

### Option 1: Direct File Replacement

1. **Replace the file:**
   ```bash
   # Backup current version
   cp src/core-scene.js src/core-scene-backup.js
   
   # Replace with new agent scene
   cp core-scene-agent.js src/core-scene.js
   ```

2. **Test locally:**
   ```bash
   python3 -m http.server 4173
   # Open http://localhost:4173
   ```

3. **Commit to repository:**
   ```bash
   git add src/core-scene.js
   git commit -m "feat: replace core sphere with animated AI agent portrait

   - Add half-body humanoid agent with geometric design
   - Implement 6 holographic UI panels showing cooperative tasks
   - Add particle streams connecting agent to work interfaces
   - Include breathing, head tracking, and gesture animations
   - Maintain 60fps performance with optimized geometry"
   
   git push origin work
   ```

### Option 2: Side-by-Side Testing

1. **Add as new file (test before replacing):**
   ```bash
   cp core-scene-agent.js src/core-scene-agent.js
   ```

2. **Update index.html temporarily:**
   ```html
   <!-- Change this line in index.html -->
   <script type="module" src="./src/main-agent.js"></script>
   ```

3. **Create test version of main.js:**
   ```bash
   cp src/main.js src/main-agent.js
   ```

4. **Edit src/main-agent.js first line:**
   ```javascript
   import { initCoreScene } from "./core-scene-agent.js";
   ```

5. **Test and compare**, then replace when satisfied.

## Performance Notes

- **Total geometry:** ~25 meshes (optimized for 60fps)
- **Particle systems:** 3 streams (120 particles) + 1 ambient field (800 particles)
- **Materials:** Reused where possible to minimize draw calls
- **Mobile:** Full detail maintained (geometry is already simplified)

## Customization Options

### Adjust Agent Colors
In `src/core-scene-agent.js`, find these material definitions:

```javascript
// Head color
color: 0x0ff8ff,        // Change to any hex color
emissive: 0x00bcd4,     // Glow color

// Torso color
color: 0x0ff8ff,

// Wireframe accents
color: 0x8b5cf6,        // Violet accent color
```

### Adjust Animation Speed
```javascript
// Breathing speed (line ~233)
const breathe = 1 + Math.sin(t * 1.5) * 0.015;
// Change 1.5 to speed up/slow down

// Head movement speed (line ~237)
head.rotation.y = Math.sin(t * 0.3) * 0.15;
// Change 0.3 to adjust speed

// Arm gesture speed (line ~249)
leftArm.rotation.x = Math.sin(t * 0.6) * 0.2 - 0.15;
// Change 0.6 to adjust speed
```

### Add More UI Panels
In the `panelConfigs` array (line ~168), add new objects:

```javascript
{ pos: [x, y, z], size: [width, height], color: 0x00f2ff, icon: 'task' }
```

## Troubleshooting

**Issue: Agent not visible**
- Check camera position: `camera.position.set(0, 1, 9);`
- Agent is centered at origin with offset: `agent.position.y = -0.5;`

**Issue: Low FPS**
- Reduce `ambientCount` from 800 to 400 (line ~210)
- Reduce particle stream count from 40 to 20 per stream (line ~220)

**Issue: UI panels not orbiting**
- Check `orbitSpeed` values in panelConfigs userData
- Verify animation loop is running (check browser console)

**Issue: Particle streams not visible**
- Check `blending: THREE.AdditiveBlending` (line ~239)
- Verify hand positions are being calculated correctly

## Code Structure

```
initCoreScene(canvas)
├── Scene Setup (camera, renderer, fog)
├── Lighting (3 point lights + ambient)
├── Agent Group
│   ├── Head (box + wireframe + eyes + face line)
│   ├── Neck (cylinder)
│   ├── Torso (box + wireframe + core)
│   ├── Shoulders (spheres)
│   └── Arms (groups with upper arm, elbow, forearm, hand)
├── Holographic UI Panels (6 panels with icons + progress bars)
├── Particle Streams (3 streams from hands to panels)
├── Ambient Particle Field (background particles)
├── Mouse Interaction (parallax effect)
└── Animation Loop (breathing, gestures, orbits, streams)
```

## Next Steps

1. Implement and test the scene
2. Adjust colors/speeds to match brand
3. Consider adding:
   - Sound effects on panel completion
   - Click interactions on UI panels
   - Different agent "modes" (thinking, building, protecting)
   - Multiple agents in the background
4. Optimize further if deploying to mobile-first audience

## Git Workflow

```bash
# From your project root
git checkout work

# If you're using the direct replacement method:
cp core-scene-agent.js src/core-scene.js
git add src/core-scene.js
git commit -m "feat: AI agent portrait scene"
git push origin work

# Merge to main when ready:
git checkout main
git merge work
git push origin main

# Vercel will auto-deploy from main branch
```

---

**File ready for deployment.** No additional dependencies required.
