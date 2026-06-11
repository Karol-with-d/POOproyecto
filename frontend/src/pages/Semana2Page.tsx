import { useNavigate } from 'react-router-dom';

/**
 * Semana2Page — Hub de actividades de la Semana 2: Identificando objetos.
 *
 * Diseño basado en el mockup Tiny Travelers con temática de objetos.
 */
export default function Semana2Page() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/home');
  const handleHome = () => navigate('/home');

  const activities = [
    {
      id: 'coleccionando-objetos',
      title: 'Coleccionando objetos',
      desc: 'Busca y colecciona objetos ocultos en el aula.',
      image: 'https://lh3.googleusercontent.com/aida/AP1WRLuBAFGl9uoR_P6VSeXXdJOZt6FyvWJMpoYbIA9wP2EFYq9CyOq5Ub87RE92HqhZpzuCaySyaxyV9BxhQIg-Jr6AehAph_PTC27SNCW5--EfUoRhEqAXBnsmWsvUZTZ-s_CE951xWKYgoLkHSb0gAMNnv56oYlUxloOiBpEIjleNzKZ-UNgyVvXY6L7eNI8zd5IR1HyNkjyYvQQ4V0CAnHKyPTKtj45cjnDTKuB60Jya9N3ynMIf_hN0mrA',
    },
    {
      id: 'caja-misteriosa',
      title: 'La caja misteriosa',
      desc: '¿Qué objeto hay dentro? Usa pistas para adivinar.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmkrI5dRejfAjvdyOaC4ISzBMdeaiJLN1f2BqM6ajcRzat0MLYQ4iCOfwHLtRXuaCJYn83uydy1HLq1KoDJx2ugtSBlm_awysqCLYGKZuaRa-RQj_qvh1-8NWCkQeNUeijIrpuUjFblb6ZNJwy2LKr3Cyg-Riader74J9pPtcZzf5WVRrdMKFurPaUUeOYc7LSVqHGXAoX6hOnlWTytlcVdNhVElezY5Zhalscu-KSRXf6naE_eBifAJQ-zOlio-k96xJjszCkzy4O',
    },
    {
      id: 'fabrica-misteriosa',
      title: 'La fábrica misteriosa',
      desc: 'Observa y clasifica objetos que se están creando.',
      image: 'https://lh3.googleusercontent.com/aida/AP1WRLvOJb3KNn79mXr-Y3GICrlBTHbLphPMJYm13Iu72dzZ28BfYFbxMkKZdd1DjivYXdAodA7FK6s2z7t1N4nOzJ-s1y-SCcD7fA58tCL5BPyznFbI4sIjGghDWzWqrrpxpv9rraCz_qKEu1AwAhQJpYMaNwHW7YtRKBSbPUx8jyeeDRhxZFsqrMpYQZ4U14kjGHa22kregYK7Qzsngv4L1Hrs64eGS-90Iu_ERVq4ucPvn-K-BeR3iCBGpyIz',
    },
  ];

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col items-center bg-[#F9F9FA]">
      {/* Main Container */}
      <div className="w-full max-w-[946px] bg-[#F9F9FA] min-h-screen relative overflow-hidden flex flex-col shadow-xl">
        {/* Background Decorators */}
        <div className="absolute top-16 right-8 w-16 h-16 opacity-70 pointer-events-none">
          <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40L50 0Z" fill="#F4E08B" />
            <circle cx="80" cy="20" fill="#A7D4AE" r="5" />
            <circle cx="20" cy="80" fill="#A7D4AE" r="3" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 w-20 h-20 opacity-70 pointer-events-none">
          <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L55 45L90 50L55 55L50 90L45 55L10 50L45 45L50 10Z" fill="#F4E08B" />
          </svg>
        </div>

        {/* Header */}
        <header className="bg-[#A7D4AE] w-full h-14 flex items-center justify-between px-6 z-10 sticky top-0">
          <button
            onClick={handleBack}
            className="text-[#1A1A1A] hover:opacity-70 transition-opacity p-2"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[#1A1A1A] tracking-wide">Tiny Travelers</h1>
          <button
            onClick={handleHome}
            className="text-[#1A1A1A] hover:opacity-70 transition-opacity p-2"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-8 py-10 flex flex-col items-center z-10">
          {/* Section Title */}
          <div className="text-center mb-10 w-full max-w-3xl relative">
            <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#1A1A1A] mb-3 leading-tight">
              Semana 2: Identificando objetos
            </h2>
            <p className="text-lg md:text-xl text-[#4A4A4A] font-medium">
              Descubre el mundo de los objetos con estos divertidos desafíos.
            </p>
            {/* Little Astronaut Decorator */}
            <div className="absolute -right-4 -top-8 w-16 h-16 hidden md:block animate-bounce">
              <img
                alt="Astronaut Decorator"
                className="w-full h-full object-contain drop-shadow-md rounded-full bg-[#A7D4AE]"
                src="https://lh3.googleusercontent.com/aida/AP1WRLukPvgDMzgwIyLzZw43oqebssELu4tZxSDi4GAozierBlwPNojkfwZ6RxcIhPqzuaL6y5LlcOTrydHcfegSf8QwcaqOoApUFNLEbtCmoqRa7qp-xPYsyuCUCJt9-3uDtuj7mdv6QGKuVmAcsoqakQOkvfCLOyBkUfIKB0Cy2ggRi5mEJ4Wx_7pt_HyVzDS-PAuv5ytEOKPTFNV4XsEx9p50FN6KU8bwgIFdqHFZhdQZIWWnCyE43Xt1MY87"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 rounded-[3rem] relative w-full max-w-[850px]">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="bg-[#F2E8D5] rounded-2xl p-4 flex flex-col h-full border-2 border-[#E1D5BD] shadow-[0_4px_6px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="bg-white rounded-xl mb-4 aspect-square flex items-center justify-center p-2 overflow-hidden border border-[#E1D5BD]">
                  <img
                    alt={activity.title}
                    className="w-full h-full object-cover rounded-lg"
                    src={activity.image}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-lg leading-tight mb-2 text-[#1A1A1A]">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] mb-4 flex-1">
                    {activity.desc}
                  </p>
                  <button
                    onClick={() => alert('Próximamente')}
                    className="bg-[#4D6B53] text-white font-bold py-3 px-4 rounded-full w-full hover:bg-opacity-90 transition-colors shadow-sm"
                  >
                    Jugar
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Learn with Marta Section */}
          <section className="mt-12 w-full max-w-[850px] relative">
            <div className="absolute -top-8 left-6 z-30 bg-[#F2E8D5] border-2 border-[#E1D5BD] px-4 py-1 rounded-full shadow-sm">
              <span className="text-[#1A1A1A] font-bold text-sm md:text-base">Aprende con Marta</span>
            </div>
            {/* Classroom Background */}
            <div className="bg-[#F0C9A3] rounded-2xl border-4 border-white shadow-[0_4px_6px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden relative h-[220px] md:h-[260px] w-full flex items-end">
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLsx3DKtmPqQglnPKdZvXHT7tk3UV867Agg1DlyTPWGDkpzD26czLCbkTa1ZN20Mht73Y4Cwnqt_D5-lXuGCUaqUnkcx33z3VpvN9xZ2JLfFyOxB1S_BU47rdIjknVoWkiGcbCVBQZXWsU2I_ze1PYB1qOU3QuICLKIgSfRE76tzYJlqK2hC_q0PAy7Asd3skpftJVjbt3YQ0ZBSQQGo3c7a2ZTUBGKZTNHA-3OSE6DmRvgJbRkuRZG1KqPT"
                className="absolute inset-0 w-full h-full object-cover"
                alt="Aula de clases"
                loading="lazy"
              />
              <button
                className="absolute bottom-4 right-4 z-30 w-16 h-16 bg-[#4D6B53] border-4 border-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform duration-300 translate-y-1/2 hover:scale-110"
                onClick={() => alert('Próximamente')}
              >
                <span className="text-white font-bold text-xs tracking-wider">START</span>
              </button>
            </div>
          </section>

          {/* Final Quiz Banner */}
          <section className="mt-8 w-full max-w-[850px] bg-[#2C2D2E] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl mb-10 z-20 relative overflow-hidden">
            <div className="text-white mb-6 md:mb-0 z-10 w-full md:w-auto text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">¡Quiz Final de la Semana!</h2>
              <p className="text-gray-300 text-sm md:text-base">¿Cuánto has aprendido esta semana? ¡Hagámoslo!</p>
            </div>
            <button
              onClick={() => alert('Próximamente')}
              className="bg-[#4D6B53] border-2 border-[#668C6D] text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-full hover:bg-opacity-90 transition-colors shadow-lg z-10 whitespace-nowrap text-lg"
            >
              Hacer Quiz
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
