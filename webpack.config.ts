import * as path from 'path';

export default {
    mode: 'development', // Set to 'production' for minification in production builds
    entry: './src/index.ts', // Change this if your entry point is different
    output: {
        filename: 'bundle.ts', // The output filename
        path: path.resolve(path.dirname("."), 'dist'), // Output directory, corresponding to 'outDir'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'], // Enable importing .ts and .js files
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Match .ts or .tsx files
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true, // This allows faster builds
                        compilerOptions: {
                            noEmit: true, // Prevent TypeScript from emitting .js files
                        },
                    }
                }, // Utilize ts-loader for TypeScript
                exclude: /node_modules/, // Exclude node_modules directory
            },
        ],
    },
    devtool: 'source-map', // Helpful for debugging
};
