function node(val) {
    this.val = val;
    this.next = null;
}

function sumTwoList(la, lb) {
    if (la == null || lb == null) return null;
    let l1 = reverse(la),
        l2 = reverse(lb),
        res = new node(0);
    while (l1.next !== null || l2.next !== null) {
        let sum = 0,
            flag = false;
        if (l1.next != null) {
            sum += l1.val;
        }
        if (l2.next != null) {
            sum += l1.val;
        }
        if (sum >= 10) {
            sum = sum % 10;
            flag = true;
        }
        if (flag) {
            res.val = sum;
            flag = false;
        }
        res.next = new node(sum);
        res = res.next;
    }
    return reverse(res);
}

function reverse(list) {
    let a = null;
    let next = null;
    while (list != null) {
        next = list.next;
        list.next = a;
        a = list;
        list = next;
    }
    return a;
}
