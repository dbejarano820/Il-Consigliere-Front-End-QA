import axios from 'axios';
import auth from './auth';

class Roles {
    constructor() {
        this.roles = []
    }

    getRoles() {
        return this.roles;
    }

    setRoles(roles) {
        this.roles = roles;
    }

    cleanRoles() {
        this.roles = [];
    }

    isUserModifier() {
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].id_permiso === 1) {
                return true;
            }
        }
        return false;
    }

    isCouncilModifier() {
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].id_permiso === 2) {
                return true;
            }
        }
        return false;
    }

    async checkRoles() {
        try {
            const user = auth.getInfo();
            if (user.cedula === '') {
                this.roles = [];
            } else {
                const roles = await axios.get(`http://localhost:5000/usuario/permisos/${user.cedula}`);
                this.setRoles(roles.data);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default new Roles();
