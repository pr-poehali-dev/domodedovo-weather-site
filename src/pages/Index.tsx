import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    condition: string;
    humidity: number;
    wind: number;
    pressure: number;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    description: string;
  }>;
}

const Index = () => {
  const [weather, setWeather] = useState<WeatherData>({
    current: {
      temp: 22,
      feels_like: 20,
      condition: 'sunny',
      humidity: 65,
      wind: 12,
      pressure: 1013,
    },
    forecast: [
      { day: 'Понедельник', temp: 23, condition: 'sunny', description: 'Солнечно' },
      { day: 'Вторник', temp: 20, condition: 'cloudy', description: 'Облачно' },
      { day: 'Среда', temp: 18, condition: 'rainy', description: 'Дождь' },
      { day: 'Четверг', temp: 19, condition: 'cloudy', description: 'Облачно' },
      { day: 'Пятница', temp: 24, condition: 'sunny', description: 'Солнечно' },
      { day: 'Суббота', temp: 25, condition: 'sunny', description: 'Ясно' },
      { day: 'Воскресенье', temp: 21, condition: 'cloudy', description: 'Переменная облачность' },
    ],
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'Sun';
      case 'cloudy':
        return 'Cloud';
      case 'rainy':
        return 'CloudRain';
      default:
        return 'Sun';
    }
  };

  const getGradientClass = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'gradient-sunny';
      case 'cloudy':
        return 'gradient-sky';
      case 'rainy':
        return 'gradient-night';
      default:
        return 'gradient-sunny';
    }
  };

  return (
    <div className={`min-h-screen ${getGradientClass(weather.current.condition)} relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-slide-up">
          <h1 className="text-6xl font-black text-white mb-2">Домодедово</h1>
          <p className="text-2xl text-white/90">
            {currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <p className="text-xl text-white/80">
            {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <Card className="glass-effect border-white/30 mb-8 animate-fade-in">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="animate-float">
                      <Icon name={getWeatherIcon(weather.current.condition)} size={80} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-7xl font-black text-white">{weather.current.temp}°</h2>
                      <p className="text-xl text-white/80">Ощущается как {weather.current.feels_like}°</p>
                    </div>
                  </div>
                  <p className="text-2xl text-white font-semibold capitalize">
                    {weather.current.condition === 'sunny' && 'Солнечно'}
                    {weather.current.condition === 'cloudy' && 'Облачно'}
                    {weather.current.condition === 'rainy' && 'Дождливо'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-effect rounded-2xl p-4 text-center">
                    <Icon name="Droplets" size={32} className="text-white mx-auto mb-2" />
                    <p className="text-sm text-white/70">Влажность</p>
                    <p className="text-2xl font-bold text-white">{weather.current.humidity}%</p>
                  </div>
                  <div className="glass-effect rounded-2xl p-4 text-center">
                    <Icon name="Wind" size={32} className="text-white mx-auto mb-2" />
                    <p className="text-sm text-white/70">Ветер</p>
                    <p className="text-2xl font-bold text-white">{weather.current.wind} м/с</p>
                  </div>
                  <div className="glass-effect rounded-2xl p-4 text-center">
                    <Icon name="Gauge" size={32} className="text-white mx-auto mb-2" />
                    <p className="text-sm text-white/70">Давление</p>
                    <p className="text-2xl font-bold text-white">{weather.current.pressure}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="week" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 glass-effect border-white/30">
              <TabsTrigger value="week" className="text-white data-[state=active]:bg-white/30">
                Неделя
              </TabsTrigger>
              <TabsTrigger value="details" className="text-white data-[state=active]:bg-white/30">
                Подробнее
              </TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {weather.forecast.map((day, index) => (
                  <Card
                    key={index}
                    className="glass-effect border-white/30 hover:scale-105 transition-transform duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <p className="text-white font-semibold mb-2">{day.day}</p>
                      <Icon
                        name={getWeatherIcon(day.condition)}
                        size={48}
                        className="text-white mx-auto mb-2 animate-float"
                        style={{ animationDelay: `${index * 0.5}s` }}
                      />
                      <p className="text-3xl font-black text-white">{day.temp}°</p>
                      <p className="text-sm text-white/70 mt-2">{day.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <Card className="glass-effect border-white/30">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-6">Детальный прогноз</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 glass-effect rounded-xl">
                        <Icon name="Thermometer" size={32} className="text-white" />
                        <div>
                          <p className="text-white/70 text-sm">Температура</p>
                          <p className="text-white text-xl font-bold">{weather.current.temp}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 glass-effect rounded-xl">
                        <Icon name="Eye" size={32} className="text-white" />
                        <div>
                          <p className="text-white/70 text-sm">Видимость</p>
                          <p className="text-white text-xl font-bold">10 км</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 glass-effect rounded-xl">
                        <Icon name="Sunrise" size={32} className="text-white" />
                        <div>
                          <p className="text-white/70 text-sm">Восход</p>
                          <p className="text-white text-xl font-bold">05:42</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 glass-effect rounded-xl">
                        <Icon name="CloudRain" size={32} className="text-white" />
                        <div>
                          <p className="text-white/70 text-sm">Вероятность осадков</p>
                          <p className="text-white text-xl font-bold">20%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 glass-effect rounded-xl">
                        <Icon name="Navigation" size={32} className="text-white" />
                        <div>
                          <p className="text-white/70 text-sm">Направление ветра</p>
                          <p className="text-white text-xl font-bold">СЗ</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 glass-effect rounded-xl">
                        <Icon name="Sunset" size={32} className="text-white" />
                        <div>
                          <p className="text-white/70 text-sm">Закат</p>
                          <p className="text-white text-xl font-bold">20:15</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
