# Instructions for integrating the CHI 2027 islands

This directory contains three independent, code-native islands. Preserve their current silhouettes, materials, placement of architecture and plants, and animations unless the project owner explicitly asks for a design change.

## Choose the asset path

1. Prefer `src/index.js` and `createIsland()` when the host is a Three.js or React Three Fiber application. This path retains procedural edits and the existing animations.
2. Use `models/*.glb` for a static visual import into another engine. Pair each GLB with its matching `.navigation.json`. The GLB alone does not carry procedural motion, collision rules, or navigation behavior.
3. Do not import assets from Blender or reconstruct these scenes from screenshots.

## Navigation contract

- `Y` is up. All `query(x,z)` inputs use one island's local coordinates. Use `queryWorld(THREE.Vector3)` after positioning or rotating the group.
- Call `query` with the player's actual horizontal radius. Block movement when `walkable` is false. Use `height` as the proposed foot level and `slopeDegrees` to enforce the host's slope limit. Evaluate step height between the old and new foot levels before moving.
- `surfaceType` distinguishes stairs, ramps, elevated walkways, decks, landings, and natural terrain. Use this label to tune movement without modifying the visual mesh.
- `walkables` contains the actual surfaces to use for raycasting or navmesh generation. The named `NAV_` nodes in GLB match `walkableNodes` in JSON. Ignore the geological underside for walking.
- The outline and water mask in JSON are fallback data for other engines. The procedural query is more exact than the sampled water grid.
- Decorative plants are soft scenery. Trees, water, the Pinwheel mast, and Verdant greenhouse walls are hard blocked regions in the runtime query. Add colliders for thin rails, posts, and animated parts if your interaction design needs physical contact with them.

## Bridges and placement

- Use `bridgeLandings()` or `bridgeLandings` in JSON for the two prepared connection points on each island. Their `outward` vectors indicate the direction a bridge should leave the island. Use the reported world position after applying each island transform.
- Build bridges in the host app. Connect each end to a landing deck with matching foot height, then test walking continuously across the joint. Check clearance from trees, installations, water, and the geological edge.
- Keep bridges separate from the procedural island modules so island geometry stays independently editable.

## Animation and testing

- Call `island.update(deltaSeconds, elapsedSeconds)` once per rendered frame. `deltaSeconds` and `elapsedSeconds` are in seconds.
- Before shipping, inspect all three islands from overhead and player height. Test boundary rejection, water blocking, actual stair steps, slope transitions, deck support, and each bridge joint with the host's player controller.
- After changing geometry, run `npm run export:models` and keep each GLB synchronized with its navigation JSON and source. Validate loaded GLB node names and regenerate the host's navmesh if applicable.

The demo is a visual and animation check only; it intentionally does not implement the host's player controls.
