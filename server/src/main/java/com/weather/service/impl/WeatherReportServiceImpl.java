package com.weather.service.impl;

import com.weather.entity.UserEntity;
import com.weather.repository.UserRepository;
import com.weather.service.WeatherReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.weather.dto.WeatherReportDto;
import com.weather.entity.WeatherReportEntity;
import com.weather.repository.WeatherReportRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeatherReportServiceImpl implements WeatherReportService {
    private WeatherReportRepository weatherReportRepository;
    private UserRepository userRepository;

    @Autowired
    public WeatherReportServiceImpl(WeatherReportRepository weatherReportRepository,
                                    UserRepository userRepository) {
        this.weatherReportRepository = weatherReportRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<WeatherReportDto> findAllReports() {
        List<WeatherReportEntity> reports = weatherReportRepository.findAll();
        return reports.stream().map(WeatherReportServiceImpl::mapToWeatherReportDto).collect(Collectors.toList());
    }

    @Override
    public WeatherReportDto createReport(WeatherReportEntity weatherReportEntity, Integer userId) {
        UserEntity userEntity = userRepository.findById(userId).get();
        weatherReportEntity.setUser(userEntity);
        return mapToWeatherReportDto(weatherReportRepository.save(weatherReportEntity));
    }

    @Override
    public WeatherReportDto updateReportData(Long reportId, Integer temperature, String description) {
        WeatherReportEntity weatherReportEntity = weatherReportRepository.getReferenceById(reportId);
        weatherReportEntity.setTemperature(temperature);
        weatherReportEntity.setWeatherDescription(description);
        return mapToWeatherReportDto(weatherReportRepository.save(weatherReportEntity));
    }

    public static WeatherReportDto mapToWeatherReportDto(WeatherReportEntity reportEntity) {

        return WeatherReportDto.builder()
                .reportId(reportEntity.getReportId())
                .city(reportEntity.getCity())
                .weatherDescription(reportEntity.getWeatherDescription())
                .createdAt(reportEntity.getCreatedAt())
                .userName(reportEntity.getUser().getUserLogin())
                .build();
    }

}
