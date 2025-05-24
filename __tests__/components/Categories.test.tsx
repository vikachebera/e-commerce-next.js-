import {render, screen} from '@testing-library/react';
import Categories from "@/components/Categories/Categories";

jest.mock('@lib/prisma', () => ({
    category: {
        findMany: jest.fn().mockResolvedValue([
            {id: '1', name: 'Смартфони'},
            {id: '2', name: 'Ноутбуки'},
        ]),
    },
}));

describe('Categories component', () => {
    it('renders list of categories from prisma', async () => {
        render(await Categories());


        expect(screen.getByText('Смартфони')).toBeInTheDocument();
        expect(screen.getByText('Ноутбуки')).toBeInTheDocument();

// eslint-disable-next-line testing-library/no-node-access
        expect(screen.getByText('Смартфони').closest('a')).toHaveAttribute('href', '/categories/1');
        // eslint-disable-next-line testing-library/no-node-access
        expect(screen.getByText('Ноутбуки').closest('a')).toHaveAttribute('href', '/categories/2');
    });
});
