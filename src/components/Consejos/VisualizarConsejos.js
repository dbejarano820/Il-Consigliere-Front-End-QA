import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Navegacion from '../Navegacion/Navegacion';
import auth from '../../helpers/auth';
import './VisualizarConsejos.css';

export default class VisualizarConsejos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consejos: [],
      redirect: false
    }
  }

  componentDidMount() {
    this.getCouncils();
  }

  deleteCouncil(e, consecutivo) {
    e.preventDefault();
    auth.verifyToken()
      .then(value => {
        if (value) {
          swal({
            title: "Confirmación",
            text: `Se eliminará toda la información del consejo ${consecutivo}`,
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
            dangerMode: true,
          })
            .then((willDelete) => {
              if (willDelete) {
                axios.delete(`/punto/por_consejo/${consecutivo}`)
                  .then(() => {
                    axios.delete(`/convocado/por_consejo/${consecutivo}`)
                      .then(() => {
                        axios.delete(`/consejo/${consecutivo}`)
                          .then(() => {
                            this.getCouncils();
                          })
                          .catch((err) => console.log(err));
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              }
            });
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  getCouncils() {
    auth.verifyToken()
      .then(value => {
        if (value) {
          axios.get('/consejo')
            .then(res => {
              if (res.data.success) {
                this.setState({
                  consejos: res.data.councils
                });
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            redirect: true
          })
          auth.logOut();
        }
      })
      .catch((err) => console.log(err));
  }

  councilList() {
    const councils = [];
    for (let i = 0; i < this.state.consejos.length; i++) {
      let consecutivo = this.state.consejos[i].consecutivo;
      let institucion = this.state.consejos[i].institucion;
      let escuela = this.state.consejos[i].escuela;
      let consejo = this.state.consejos[i].nombre_consejo;
      let lugar = this.state.consejos[i].lugar;
      let fecha = this.state.consejos[i].fecha;
      let hora = this.state.consejos[i].hora;
      let id_tipo_sesion = this.state.consejos[i].id_tipo_sesion;
      councils.push(
        <div className="col-md-4" key={i}>
          <div className="card border-primary mb-3">
            <div className="card-body">
              <div className='d-flex justify-content-between align-items-center'>
                <p className="card-title m-0">{institucion}</p>
                <div className='d-flex justify-content-between align-items-center'>
                  <Link to={`/gConsejos/${consecutivo}`}><i className="fas fa-edit fa-lg ml-2 consejo-icon" style={{ color: "navy" }}></i></Link>
                  <i className="fas fa-trash-alt my-icon fa-lg ml-2" onClick={(e) => this.deleteCouncil(e, consecutivo)} />
                </div>
              </div>
              <p className='m-0'>{escuela}</p>
              <p className='m-0'>{consejo}</p>
              <p className='m-0'>Sesión {id_tipo_sesion === 1 ? 'Ordinaria' : 'Extraordinaria'} {consecutivo}</p>
              <p className='m-0'>Lugar: {lugar}</p>
              <p className='m-0'>Fecha: {fecha}</p>
              <p className='m-0'>Hora: {hora}</p>
            </div>
          </div>
        </div>
      );
    }
    return councils;
  }

  render() {
    return (this.state.redirect ? <Redirect to='/' /> :
      <>
        <Navegacion />
        <div className='container'>
          <h4>Próximos Consejos</h4>
          <hr />
        </div>
        <div className="row m-0 mt-4">
          {this.state.consejos.length === 0 ? <p className='my-muted'>No hay próximos consejos para mostrar</p> : this.councilList()}
        </div>
        <div className='container'>
          <h4>Consejos anteriores</h4>
          <hr />
        </div>
      </>
    );
  }
}