import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/calendar.js',
    dest: 'dist/index.js',
    format: 'cjs',
    external: ['react'],
    plugins: [
        babel()
    ]
}
