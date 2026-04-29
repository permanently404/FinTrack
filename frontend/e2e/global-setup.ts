import { execSync } from "child_process";
import { writeFileSync } from "fs";
import path from "path";

const API = 'http://localhost:4000';

export default async function globalSetup() {

    execSync('npm run seed', {
        cwd: path.resolve(__dirname, '../../backend'),
        stdio: 'inherit'
    });

    const res = await fetch(`${API}/api/auth/login`, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@test.com',
            password: '12345Test',
        })
    });

    if (!res.ok) throw new Error(`Failed to login: ${res.status}`);

    const { accessToken, refreshToken, user } = await res.json();

    const storageState = {
        cookies: [],
        origins: [{
            origin: 'http://localhost:3000',
            localStorage: [
                { name: 'accessToken', value: accessToken },
                { name: 'refreshToken', value: refreshToken },
                { name: 'authUser', value: JSON.stringify(user) },
            ],
        }]
    }

    writeFileSync(
        path.resolve(__dirname, 'storageState.json'),
        JSON.stringify(storageState, null, 2)
    )

    console.log('✓ Seed выполнен, сессия сохранена')
}
