package com.nexus.foreigner_community.repository;

import com.nexus.foreigner_community.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}

