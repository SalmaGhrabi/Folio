package com.example.folio_backend.book;

import org.springframework.stereotype.Service;

@Service
public class BookMapper {
    public Book toBook(BookRequest request) {
        return Book.builder()
                .id(request.id())
                .title(request.title())
                .authorName(request.authorNAme())
                .synopsis(request.synopsis())
                .archived(false)
                .shareable(request.shareable())
                .build();
    }
}
