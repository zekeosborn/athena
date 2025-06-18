export const vertex = `
  uniform float uSize;
  uniform float uTime;

  attribute float aScale;

  varying vec3 vColor;
  varying float vOpacity;

  void main()
  {
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.x -= (uTime * 1.0) * (1.0 - aScale);
    modelPosition.y -= (uTime * 0.3) * (1.0 - aScale);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    /**
     * Varying
     */
    vColor = color;
    vOpacity = 1.0 - uTime * 0.3;
  }
`;

export const fragment = `
  varying vec3 vColor;
  varying float vOpacity;

  void main()
  {
    vec3 blackColor = vec3(0.0);
    vec3 whiteColor = vColor;
    float strength = 0.15 / (distance(vec2(gl_PointCoord.x, (gl_PointCoord.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    strength *= 0.15 / (distance(vec2(gl_PointCoord.y, (gl_PointCoord.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

    vec3 mixedColor = mix(blackColor, whiteColor, strength);

    gl_FragColor = vec4(mixedColor, vOpacity);
  }
`;