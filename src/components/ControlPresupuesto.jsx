import { useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import Swal from 'sweetalert2'

const ControlPresupuesto = ({ presupuesto, gastos, setGastos, setPresupuesto, setIsValidPresupuesto }) => {

    const [porcentaje, setPorcentaje] = useState(0)

    const [disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)

    useEffect(() => {
        const totalGastado = gastos.reduce((total, gasto) => gasto.cantidad + total, 0)

        const totalDisponible = presupuesto - totalGastado

        //Calcular el porcentaje
        const nuevoPorcentaje = (((presupuesto - totalDisponible) / presupuesto) * 100).toFixed(2)

        setDisponible(totalDisponible)
        setGastado(totalGastado)

        setTimeout(() => {
            setPorcentaje(nuevoPorcentaje)
        }, 1000);
    }, [gastos])

    const formatearCantidad = (cantidad) => {
        return cantidad.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        })

    }

    const handleResetApp = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No vas a poder revertir esto..",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, resetear',
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                setGastos([])
                setPresupuesto(0)
                setIsValidPresupuesto(false)
                Swal.fire(
                    'Aplicacion Reseteada',
                    'La aplicación ha sido reseteada correctamente',
                    'success'
                )
            }
        })
    }

    return (
        <div className="contenedor-presupuesto contenedor sombra dos-columnas">
            <div><CircularProgressbar
                value={porcentaje}
                styles={buildStyles({
                    pathColor: porcentaje > 100 ? '#dc2626' : "#3b82f6",
                    trailColor: "#f5f5f5",
                    textColor: porcentaje > 100 ? '#dc2626' : "#3b82f6"
                })}
                text={`${porcentaje}% Gastado`}
            ></CircularProgressbar></div>
            <div className="contenido-presupuesto">
                <button className='reset-app' type='button' onClick={handleResetApp}>
                    Resetear App
                </button>
                <p><span>Presupuesto: </span> {formatearCantidad(presupuesto)}</p>
                <p className={`${disponible < 0 ? 'negativo' : ''}`}><span>Disponible: </span> {formatearCantidad(disponible)}</p>
                <p><span>Gastado: </span> {formatearCantidad(gastado)}</p>
            </div>
        </div>
    );
}

export default ControlPresupuesto;