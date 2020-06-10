import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Navegacion from '../Navegacion/Navegacion';
import axios from 'axios';
import swal from 'sweetalert';
import auth from '../../helpers/auth'
import './Acceso.css';

export default class Acceso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cedula: '',
            clave: '',
            redirect: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        auth.isAuthenticated()
            .then(token => {
                if (token) {
                    this.setState({
                        redirect: true
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    handleInputChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        if ((name === 'cedula') && (!Number(value)) && (value !== '')) {
            return;
        }
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const usuario = {
            cedula: this.state.cedula,
            clave: this.state.clave
        }
        axios.post('http://localhost:5000/usuario/inicio_sesion', usuario)
            .then(res => {
                if (res.data.success) {
                    localStorage.setItem('il-consigliere', JSON.stringify({
                        token: res.data.token
                    }));
                    this.setState({
                        redirect: true
                    });
                } else {
                    swal({
                        title: "Credenciales Incorrectos",
                        text: "La información proporcionada no corresponde a ningún usuario.",
                        icon: "error",
                        button: "Ok"
                    });
                    this.setState({
                        clave: ''
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    render() {
        return this.state.redirect ? <Redirect to='/consejos' /> :
            <>
                <Navegacion />
                <div className="row m-0 my-row">
                    <div className="col-md-5 m-auto">
                        <div className="card border-primary mb-3">
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">Il Consigliere</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="text" required maxLength="20" name="cedula"
                                            placeholder="Cédula" autoComplete="off" className="form-control"
                                            autoFocus onChange={this.handleInputChange} value={this.state.cedula} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" required maxLength="20" name="clave"
                                            placeholder="Contraseña" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.clave} />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-outline-primary btn-block mt-4">Accesar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="alert alert-dismissible my-border alert-light pb-0">
                            <button type="button" className="close" data-dismiss="alert">&times;</button>
                            <p>Recuerda solicitar una cuenta a la persona encargada del sistema.</p>
                        </div>
                    </div>
                </div>
            </>
    }
}
