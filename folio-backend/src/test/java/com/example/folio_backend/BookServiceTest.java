package com.example.folio_backend;

import com.example.folio_backend.book.Book;
import com.example.folio_backend.book.BookRepository;
import com.example.folio_backend.book.BookService;
import com.example.folio_backend.exception.OperationNotPermittedException;
import com.example.folio_backend.history.BookTransactionHistoryRepository;
import com.example.folio_backend.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private BookTransactionHistoryRepository transactionHistoryRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private BookService bookService;

    @Test
    @DisplayName("Should throw exception when user tries to borrow their own book")
    void shouldThrowExceptionWhenBorrowingOwnBook() {
        // Arrange
        Integer bookId = 1;
        User owner = User.builder().id(10).build();

        Book book = Book.builder()
                .id(bookId)
                .owner(owner)
                .shareable(true)
                .build();

        when(bookRepository.findByIdForUpdate(bookId)).thenReturn(Optional.of(book));
        when(authentication.getPrincipal()).thenReturn(owner);

        // Act & Assert
        OperationNotPermittedException exception = assertThrows(
                OperationNotPermittedException.class,
                () -> bookService.borrowBook(bookId, authentication)
        );

        assertEquals("You cannot borrow your own book", exception.getMessage());
        verify(transactionHistoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw exception when book is not shareable")
    void shouldThrowExceptionWhenBookNotShareable() {
        // Arrange
        Integer bookId = 2;
        User owner = User.builder().id(10).build();
        User borrower = User.builder().id(20).build();

        Book book = Book.builder()
                .id(bookId)
                .owner(owner)
                .shareable(false)
                .build();

        when(bookRepository.findByIdForUpdate(bookId)).thenReturn(Optional.of(book));
        // Act & Assert
        assertThrows(
                OperationNotPermittedException.class,
                () -> bookService.borrowBook(bookId, authentication)
        );

        verify(transactionHistoryRepository, never()).save(any());
    }
}
