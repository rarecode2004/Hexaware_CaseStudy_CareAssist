package com.hexaware.careassist_claims.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hexaware.careassist_claims.dto.InvoiceDTO;

@SpringBootTest
class InvoiceServiceImplTest {

    @Autowired
    private IInvoiceService service;

    @Test
    void testAddInvoice() {

        InvoiceDTO invoice = new InvoiceDTO();
        invoice.setInvoiceNumber("INV-101");
        invoice.setPatientId(1);
        invoice.setTotalAmount(2500);
        invoice.setStatus("Pending");

        int result = service.addInvoice(invoice);

        assertEquals(1, result);
    }

    @Test
    void testGetAllInvoices() {

        List<InvoiceDTO> list = service.getAllInvoices();

        assertNotNull(list);
        assertTrue(list.size() >= 0);
    }

    @Test
    void testGetInvoiceById() {

        InvoiceDTO invoice = service.getInvoiceById(1);

        assertNotNull(invoice);
    }

    @Test
    void testGetInvoiceByNumber() {

        InvoiceDTO invoice = service.getInvoiceByNumber("INV-101");

        assertNotNull(invoice);
    }

    @Test
    void testGetInvoicesByPatientId() {

        List<InvoiceDTO> list = service.getInvoicesByPatientId(1);

        assertNotNull(list);
    }

    @Test
    void testUpdateInvoice() {

        InvoiceDTO invoice = service.getInvoiceById(1);
        invoice.setStatus("Paid");

        int result = service.updateInvoice(invoice);

        assertEquals(1, result);
    }

    @Test
    void testDeleteInvoice() {

        int result = service.deleteInvoice(1);

        assertEquals(1, result);
    }
}