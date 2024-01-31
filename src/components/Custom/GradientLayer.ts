import { GradientConfig } from '@/interfaces';

import { FrameState } from 'ol/PluggableMap';
import { Map } from 'ol';

import UVBuffer from '@/utils/UVBuffer';
import { createMatrix3FromTransform } from '@/utils/mapUtils';
import CustomWebGLLayer from './CustomWebGLLayer';
import CustomWebGLLayerRenderer from './CustomWebGLLayerRenderer';

export default class GradientLayer extends CustomWebGLLayer {
  map: Map;

  uvBuffer: UVBuffer;

  matrixLoc: WebGLUniformLocation | null;

  constructor({ map, uvBuffer, opacity }: GradientConfig) {
    super({
      opacity,
      renderFunction: (
        frameState: FrameState,
        context: WebGLRenderingContext | null,
      ) => {
        return this.reallyDoRender(frameState, context);
      },
    });

    this.map = map;
    this.uvBuffer = uvBuffer;
    this.matrixLoc = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.map.getRenderer() as any).registerLayerRenderers([
      CustomWebGLLayerRenderer,
    ]);
  }

  reallyDoRender(
    frameState: FrameState,
    context: WebGLRenderingContext | null,
  ): boolean {
    if (!context) return false;

    if (!this.matrixLoc) {
      this.createProgram(context);
    }

    this.draw(context);
    frameState.animate = true;
    return true;
  }

  createProgram(gl: WebGLRenderingContext): void {
    const ext = gl.getExtension('OES_texture_float');
    const linear = gl.getExtension('OES_texture_float_linear');

    if (!ext || !linear) return;

    const vertices = [-1, 1, -1, -1, 1, -1, 1, 1];
    const indices = [0, 1, 2, 3];
    const vertexBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    const vertCode = `
      attribute vec2 coordinates;
      void main(void) {
        gl_Position = vec4(coordinates, 0.0, 1.0);
      }
    `;
    const fragCode = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
      #else
        precision mediump float;
      #endif
        uniform sampler2D texu;
        uniform sampler2D texv;
        uniform mat3 matrix;

        vec3 colorA = vec3(0.0, 0.0, 1.0);
        vec3 colorB = vec3(0.0, 1.0, 0.0);
        vec3 colorC = vec3(1.0, 0.0, 0.0);

      void main(void) {
        mediump vec3 coord = matrix * vec3(gl_FragCoord.x, gl_FragCoord.y, 1);
        mediump float speedu = texture2D(texu, coord.xy).x;
        mediump float  speedv = texture2D(texv, coord.xy).y;
        float speed = sqrt(speedu * speedu + speedv * speedv);

        if (coord.x < 0.0 || coord.y < 0.0 || coord.x > 1.0 || coord.y > 1.0) {
          discard;
        }

        vec3 color = colorC;

        if (speed < 4.0) {
          color = mix(colorA, colorB, speed / 4.0);
        } else if (speed < 8.0) {
          color = mix(colorB, colorC, (speed - 4.0) / 4.0);
        }
        
        gl_FragColor = vec4(color.rgb, 1.0);
      }
    `;

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    if (!vertShader || !fragShader) return;

    gl.shaderSource(vertShader, vertCode);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) return;

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    gl.validateProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) return;

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const coordPtr = gl.getAttribLocation(shaderProgram, 'coordinates');

    gl.vertexAttribPointer(coordPtr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordPtr);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    this.activateTexture(gl, 0);
    this.activateTexture(gl, 1);

    const texuLoc = gl.getUniformLocation(shaderProgram, 'texu');
    const texvLoc = gl.getUniformLocation(shaderProgram, 'texv');
    gl.uniform1i(texuLoc, 0);
    gl.uniform1i(texvLoc, 1);

    this.matrixLoc = gl.getUniformLocation(shaderProgram, 'matrix');
  }

  activateTexture(gl: WebGLRenderingContext, nb: number): void {
    const {
      uvBuffer: { dataWidth, dataHeight, uBuffer, vBuffer },
    } = this;

    gl.activeTexture(nb === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      dataWidth,
      dataHeight,
      0,
      gl.LUMINANCE,
      gl.FLOAT,
      nb === 0 ? uBuffer : vBuffer,
    );
  }

  draw(gl: WebGLRenderingContext): void {
    const { map, uvBuffer, matrixLoc } = this;

    const matrix = createMatrix3FromTransform(map, uvBuffer.extent);

    gl.uniformMatrix3fv(matrixLoc, false, matrix);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const { width, height } = gl.canvas;
    gl.viewport(0, 0, width, height);
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);
  }
}
