import { Circle } from '@react-three/drei'
import { EffectComposer, Noise, Vignette, HueSaturation, GodRays } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import React, { Suspense, forwardRef } from 'react'
import { useResource } from 'react-three-fiber'
import { useControl } from 'react-three-gui'
import { Mesh } from 'three'

const Sun = forwardRef(function Sun(props, forwardRef) {
  const sunColor = useControl('sun color', { type: 'color', value: '#FF0000' })

  return (
    <Circle args={[10, 10]} ref={forwardRef} position={[0, 0, -16]}>
      <meshBasicMaterial color={sunColor} />
    </Circle>
  )
})

function Effects() {
  const sunRef = useResource<Mesh>()

  const hue = useControl('Hue', {
    group: 'Postprocessing - HueSaturation',
    value: 3.11,
    min: 0,
    max: Math.PI * 2,
    type: 'number',
  })
  const saturation = useControl('saturation', {
    group: 'Postprocessing - HueSaturation',
    value: 2.05,
    min: 0,
    max: Math.PI * 2,
    type: 'number',
  })
  const noise = useControl('Opacity', {
    group: 'Postprocessing - Noise',
    value: 0.47,
    min: 0,
    max: 1,
    type: 'number',
  })

  const exposure = useControl('exposure', {
    group: 'PostProcessing - GodRays',
    value: 0.34,
    min: 0,
    max: 1,
    type: 'number',
  })

  const decay = useControl('decay', {
    group: 'PostProcessing - GodRays',
    value: 0.9,
    min: 0,
    max: 1,
    step: 0.1,
    type: 'number',
  })

  const blur = useControl('blur', {
    group: 'PostProcessing - GodRays',
    value: false,
    type: 'boolean',
  })

  return (
    <Suspense fallback={null}>
      <Sun ref={sunRef} />

      {sunRef.current && (
        <EffectComposer multisampling={0}>
          <GodRays sun={sunRef.current} exposure={exposure} decay={decay} blur={blur} />

          <Noise
            opacity={noise}
            premultiply // enables or disables noise premultiplication
            blendFunction={BlendFunction.ADD} // blend mode
          />

          <HueSaturation hue={hue} saturation={saturation} />

          <Vignette />
        </EffectComposer>
      )}
    </Suspense>
  )
}

export default Effects
