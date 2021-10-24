def max_product(list, n):
    product = 1
    for _ in range(n):
        currentmax = max(list)
        list.remove(currentmax)
        product *= currentmax
    return product

def max_three_product(list):
    return max_product(list, 3)

def main():
    for _ in range(5):
        print(max_three_product([11, 111111111, 2323, 23232, 100000, 0, 111111111, 10, 4, 1000, 31234]))    

if __name__=="__main__":
    main()
