import { createCore } from '../core';
import { fileNodes } from '../utils/generate-styles/fixtures/file-nodes';
import { styleMetadata } from '../utils/generate-styles/fixtures/style-metadata';
import { gradientsPlugin } from './gradients-plugin';

describe('gradientsPlugin', () => {
  it('should write js file and run formatting tool', () => {
    const core = createCore({
      config: {
        styles: {
          exportPath: '/export-path/',
          gradients: {},
        },
      },
      plugins: [],
      rootPath: '/root-path',
      log: jest.fn(),
    });

    core.writeFile = jest.fn();

    gradientsPlugin(core, { styleMetadata: styleMetadata.styles, fileNodes } as any);

    expect(core.writeFile).toHaveBeenCalled();
    expect((core.writeFile as jest.Mock).mock.calls[0][1]).toBe('/export-path/gradients.js');
  });

  it('should write generated date for default config', () => {
    const core = createCore({
      config: {
        styles: {
          exportPath: '/export-path/',
          gradients: {},
        },
      },
      plugins: [],
      rootPath: '/root-path',
      log: jest.fn(),
    });

    core.writeFile = jest.fn();

    gradientsPlugin(core, { styleMetadata: styleMetadata.styles, fileNodes } as any);

    expect(core.writeFile).toHaveBeenCalled();
    expect((core.writeFile as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
  });

  it('should be skipped due to disabled field', () => {
    const core = createCore({
      config: {
        styles: {
          exportPath: '/export-path/',
          gradients: {
            disabled: true,
          },
        },
      },
      plugins: [],
      rootPath: '/root-path',
      log: jest.fn(),
    });

    core.writeFile = jest.fn();

    gradientsPlugin(core, { styleMetadata: styleMetadata.styles, fileNodes } as any);

    expect(core.writeFile).not.toHaveBeenCalled();
  });

  it('should create data with custom keyName function', () => {
    const core = createCore({
      config: {
        styles: {
          exportPath: '/export-path/',
          gradients: {
            keyName: (name?: string) => name + '__extra',
          },
        },
      },
      plugins: [],
      rootPath: '/root-path',
      log: jest.fn(),
    });

    core.writeFile = jest.fn();

    gradientsPlugin(core, { styleMetadata: styleMetadata.styles, fileNodes } as any);

    expect(core.writeFile).toHaveBeenCalled();
    expect((core.writeFile as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
  });
});
