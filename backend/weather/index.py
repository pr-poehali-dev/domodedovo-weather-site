import json
import os
import urllib.request
import urllib.parse
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''
    API для получения актуальной погоды из OpenWeatherMap.
    Возвращает текущую погоду и прогноз на неделю для указанного города.
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('OPENWEATHER_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API key not configured'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    city = params.get('city', 'Domodedovo')
    
    try:
        current_url = f'https://api.openweathermap.org/data/2.5/weather?q={urllib.parse.quote(city)}&appid={api_key}&units=metric&lang=ru'
        with urllib.request.urlopen(current_url) as response:
            current_data = json.loads(response.read().decode())
        
        lat = current_data['coord']['lat']
        lon = current_data['coord']['lon']
        
        forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=ru'
        with urllib.request.urlopen(forecast_url) as response:
            forecast_data = json.loads(response.read().decode())
        
        daily_forecast = {}
        for item in forecast_data['list']:
            date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
            if date not in daily_forecast:
                daily_forecast[date] = {
                    'temp': item['main']['temp'],
                    'condition': item['weather'][0]['main'].lower(),
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                }
        
        forecast_list = []
        days_ru = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
        for date_str, data in list(daily_forecast.items())[:7]:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            day_name = days_ru[date_obj.weekday()]
            forecast_list.append({
                'day': day_name,
                'temp': round(data['temp']),
                'condition': map_condition(data['condition']),
                'description': data['description'].capitalize()
            })
        
        result = {
            'current': {
                'temp': round(current_data['main']['temp']),
                'feels_like': round(current_data['main']['feels_like']),
                'condition': map_condition(current_data['weather'][0]['main'].lower()),
                'humidity': current_data['main']['humidity'],
                'wind': round(current_data['wind']['speed']),
                'pressure': current_data['main']['pressure'],
                'description': current_data['weather'][0]['description'].capitalize(),
                'sunrise': datetime.fromtimestamp(current_data['sys']['sunrise']).strftime('%H:%M'),
                'sunset': datetime.fromtimestamp(current_data['sys']['sunset']).strftime('%H:%M')
            },
            'forecast': forecast_list,
            'city': current_data['name']
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except urllib.error.HTTPError as e:
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'OpenWeatherMap API error: {e.reason}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def map_condition(condition: str) -> str:
    mapping = {
        'clear': 'sunny',
        'clouds': 'cloudy',
        'rain': 'rainy',
        'drizzle': 'rainy',
        'thunderstorm': 'rainy',
        'snow': 'snowy',
        'mist': 'cloudy',
        'fog': 'cloudy'
    }
    return mapping.get(condition, 'cloudy')
