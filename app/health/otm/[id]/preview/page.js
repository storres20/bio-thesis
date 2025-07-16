// app/otm/[id]/preview/page.js
import config from '@/config';

async function getOtmData(id) {
    const [historialRes, oneDataRes] = await Promise.all([
        fetch(`${config.apiUrl}/historials/${id}`, { cache: 'no-store' }),
        fetch(`${config.apiUrl}/historialbyids/getByHistorial/${id}`, { cache: 'no-store' })
    ]);

    if (!historialRes.ok || !oneDataRes.ok) throw new Error('Failed to fetch OTM data');

    const historialData = await historialRes.json();
    const historialArray = await oneDataRes.json();
    const sortedData = Array.isArray(historialArray)
        ? historialArray.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        : [];

    return { historialData, oneData: sortedData[0], data: sortedData };
}


export default async function OtmPreviewPage({ params }) {
    const { id } = params;
    const { historialData, oneData, data } = await getOtmData(id);

    const fechaInicio = data.length > 0 ? data[0].fecha : '—';
    const fechaTermino = data.length > 0 ? data[data.length - 1].fecha : '—';


    const inv = historialData?.inventories_id || {};
    const tech = historialData?.usersid_tech || {};

    return (
        <div className="max-w-4xl mx-auto bg-white text-black p-10 border border-gray-300 shadow-sm text-sm font-sans">
            <h2 className="text-2xl font-bold text-center mb-6 uppercase">
                Orden de Trabajo de Mantenimiento (OTM)
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div><strong>Dependencia de Salud:</strong> {inv?.hospitals_id.name}</div>
                <div><strong>Área Usuaria:</strong> {inv?.location}</div>
                <div><strong>Ubicación Física:</strong> {inv?.sub_location}</div>
                <div><strong>Denominación del Equipo:</strong> {inv?.name}</div>
                <div><strong>Marca:</strong> {inv?.brand}</div>
                <div><strong>Modelo:</strong> {inv?.model}</div>
                <div><strong>Serie:</strong> {inv?.serie}</div>
                <div><strong>Código Patrimonial:</strong> {inv?.codepat}</div>
            </div>

            <div className="mb-4">
                <strong>Problema presentado en el equipo o instalación:</strong>
                <div className="border border-gray-400 p-2 mt-1 whitespace-pre-wrap">
                    {historialData?.problema}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div><strong>Fecha de recepción:</strong> {historialData?.fecha_open}</div>
                <div><strong>Prioridad:</strong> {historialData?.prioridad || '—'}</div>
            </div>

            <div className="mb-4">
                <strong>Diagnóstico técnico:</strong>
                <div className="border border-gray-400 p-2 mt-1 whitespace-pre-wrap">
                    {oneData?.diagnostico || '—'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div><strong>Modalidad de atención:</strong> {oneData?.modalidad_atencion || '—'}</div>
                <div><strong>Responsable de mantenimiento:</strong> {tech?.email || '—'}</div>
            </div>

            <div className="mb-4">
                <strong>Descripción del trabajo de mantenimiento ejecutado:</strong>
                <div className="border border-gray-400 p-2 mt-1 whitespace-pre-wrap">
                    {data.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-2">
                            {data.map((item) => (
                                <li key={item._id}>
                                    <p className="text-sm">
                                        <span className="font-semibold text-gray-700">🕒 {item.fecha}:</span> {item.note}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>—</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div><strong>Fecha de inicio:</strong> {fechaInicio}</div>
                <div><strong>Fecha de término:</strong> {fechaTermino}</div>
                <div><strong>Garantía del servicio:</strong> {oneData?.garantia || '—'}</div>
                <div><strong>Costo del servicio:</strong> {oneData?.costo || '—'}</div>
            </div>

            <div className="mb-4">
                <strong>Recomendaciones de uso y mantenimiento:</strong>
                <div className="border border-gray-400 p-2 mt-1 whitespace-pre-wrap">
                    {oneData?.recomendaciones || '—'}
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
                Formato oficial del Ministerio de Salud del Perú (versión digital adaptada)
            </div>
        </div>
    );
}
